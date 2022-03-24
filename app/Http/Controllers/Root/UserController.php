<?php

namespace App\Http\Controllers\Root;

use App\Events\Notifications\Send;
use App\Http\Controllers\Controller;
use App\Models\PaymentDocument;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Google2FA;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUser(Request $request): \Illuminate\Http\JsonResponse
    {
        $idUser = $request->json()->get("id");

        $arrayItems = [
            "users.id",
            "users.lastName",
            "users.firstName",
            "users.email",
            "users.phone",
            "users.created_at",
            "users.is_blocked",
            "users.is_blocked_payout",
            "roles.slug as role_id",
            "users.language",
            "users.is_verified_email",
            "users.avatar",
        ];

        $collectionUser = (array) DB::table("users")
            ->select($arrayItems)
            ->whereIn("roles.slug", ["broker", "user"])
            ->where("users.id", $idUser)
            ->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
            ->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
            ->first();

        $collectionMessage  = DB::table("message_for_user")
            ->select(["id", "created_at", "message", "is_read"])
            ->where("user_id", $idUser)
            ->orderBy("id", "desc")
            ->get();
        $resultArrayMessage = $collectionMessage->toArray();

        $collectionUser["role_id"] = parent::getNumberRoleForClient($collectionUser["role_id"]);

        return response()->json([
            "success"      => true,
            "user"         => $collectionUser,
            "arrayMessage" => $resultArrayMessage,
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers(Request $request): \Illuminate\Http\JsonResponse
    {
        $page    = $request->json()->get("page");
        $perPage = $request->json()->get("perPage");
        $search  = $request->json()->get("search");
        $filter  = $request->json()->get("filter");

        $whereFilter = [];
        if ($filter) {
            if (isset($filter["ban"]) && !empty($filter["ban"]) && $filter["ban"]["isActive"]) {
                switch ((string) $filter["ban"]["select"]) {
                    case "ban_true":
                        $whereFilter[] = ["users.is_blocked", true];
                        break;
                    case "ban_false":
                        $whereFilter[] = ["users.is_blocked", false];
                        break;
                }
            }
            if (isset($filter["role_id"]) && !empty($filter["role_id"]) && $filter["role_id"]["isActive"]) {
                switch ((string) $filter["role_id"]["select"]) {
                    case 0:
                        $whereFilter[] = ["roles.slug", "user"];
                        break;
                    case 1:
                        $whereFilter[] = ["roles.slug", "broker"];
                        break;
                }
            }
        }

        $resultArrayUsers = [];
        $countUsers       = 0;
        if (empty($search)) {
            $collectionUsers  = DB::table("users")
                ->select([
                    "users.id",
                    "users.lastName",
                    "users.firstName",
                    "users.email",
                    "users.phone",
                    "users.created_at",
                    "users.is_blocked",
                    "users.avatar",
                    "roles.slug as role_id",
                ])
                ->whereIn("roles.slug", ["broker", "user"])
                ->where($whereFilter)
                ->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
                ->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
                ->orderBy("users.id")
                ->skip($page * $perPage)
                ->take($perPage)
                ->get();
            $resultArrayUsers = $collectionUsers->toArray();

            $collectionCount = DB::table("users")
                ->selectRaw("COUNT(users.id) AS countId")
                ->whereIn("roles.slug", ["broker", "user"])
                ->where($whereFilter)
                ->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
                ->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
                ->first();
            $countUsers      = $collectionCount->countId;
        } else {
            $whereSearch = [
                1 => [["uses.email", "like", "%" . $search . "%"]],
                2 => [["uses.id", "like", "%" . $search . "%"]],
                3 => [["uses.firstName", "like", "%" . $search . "%"]],
                4 => [["uses.lastName", "like", "%" . $search . "%"]],
                5 => [["uses.phone", "like", "%" . $search . "%"]],
            ];

            $where      = [];
            $where[1] = array_merge($whereFilter, $whereSearch[1]);
            $where[2] = array_merge($whereFilter, $whereSearch[2]);
            $where[3] = array_merge($whereFilter, $whereSearch[3]);
            $where[4] = array_merge($whereFilter, $whereSearch[4]);
            $where[5] = array_merge($whereFilter, $whereSearch[5]);

            $collectionUsers  = DB::table("users")
                ->select([
                    "users.id",
                    "users.lastName",
                    "users.firstName",
                    "users.email",
                    "users.phone",
                    "users.created_at",
                    "users.is_blocked",
                    "users.avatar",
                    "roles.slug as role_id",
                ])
                ->whereIn("roles.slug", ["broker", "user"])
                ->where($where[1])
                ->orWhere($where[2])
                ->orWhere($where[3])
                ->orWhere($where[4])
                ->orWhere($where[5])
                ->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
                ->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
                ->orderBy("id")
                ->skip($page * $perPage)
                ->take($perPage)
                ->get();
            $resultArrayUsers = $collectionUsers->toArray();

            $collectionCount = DB::table("users")
                ->selectRaw("COUNT(users.id) AS countId")
                ->whereIn("roles.slug", ["broker", "user"])
                ->where($where[1])
                ->orWhere($where[2])
                ->orWhere($where[3])
                ->orWhere($where[4])
                ->orWhere($where[5])
                ->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
                ->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
                ->first();
            $countUsers      = $collectionCount->countId;
        }

        return response()->json([
            "success" => true,
            "array"   => $resultArrayUsers,
            "total"   => $countUsers,
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function editUsers(Request $request): \Illuminate\Http\JsonResponse
    {
        $user        = Auth::user();
        $isEnable2FA = $user->getAttributeValue(env("OTP_ENABLED_COLUMN"));

        if (!$isEnable2FA) {
            return response()->json(["success" => false, "error" => "Включите двухфакторную аутентификацию!"]);
        }
        $secret = str_replace(" ", "", $request->input("verifyCode"));
        $valid  = Google2FA::verifyKey($user->google2fa_secret, $secret);
        if (!$valid) {
            return response()->json(["success" => false, "error" => "Неверный одноразовый код"]);
        }

        $userId          = $request->json()->get("id");
        $lastName        = $request->json()->get("lastName");
        $firstName       = $request->json()->get("firstName");
        $email           = $request->json()->get("email");
        $phone           = $request->json()->get("phone");
        $isBlocked       = $request->json()->get("is_blocked");
        $isBlockedPayout = $request->json()->get("is_blocked_payout");

        $oldDataUser = (array) DB::table("users")
            ->select([
                "users.id",
                "users.lastName",
                "users.firstName",
                "users.email",
                "users.phone",
                "users.is_blocked",
                "users.is_blocked_payout",
            ])
            ->where("users.id", $userId)
            ->first();

        $newDataUser = [
            "id"                => $userId,
            "lastName"          => $lastName,
            "firstName"         => $firstName,
            "email"             => $email,
            "phone"             => $phone,
            "is_blocked"        => $isBlocked,
            "is_blocked_payout" => $isBlockedPayout,
        ];
        $today       = date("Y-m-d H:i:s");

        try {
            DB::beginTransaction();
            DB::table("edit_user_history")->insert([
                "oldData"    => json_encode($oldDataUser),
                "newData"    => json_encode($newDataUser),
                "admin_id"   => $user->id,
                "created_at" => $today,
            ]);
            unset($newDataUser["id"]);
            DB::table("users")
                ->where("id", $userId)
                ->update($newDataUser);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e);
            return response()->json(["success" => false]);
        }

        return response()->json(["success" => true]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessageUser(Request $request): \Illuminate\Http\JsonResponse
    {
        $userId  = $request->json()->get("userId");
        $message = $request->json()->get("message");
        $today   = date("Y-m-d H:i:s");

        $collectionMessage = DB::table("message_for_user")
            ->select("id")
            ->where([["user_id", $userId], ["message", $message]])
            ->first();
        if (empty($collectionMessage->id)) {
            try {
                DB::beginTransaction();
                $messageId = DB::table("message_for_user")->insertGetId([
                    "user_id"    => $userId,
                    "message"    => $message,
                    "created_at" => $today,
                ]);

                $collectionUser = DB::table("users")
                    ->select(["firstName", "lastName", "email", "language"])
                    ->where("id", $userId)
                    ->first();

                $nickname = $collectionUser->firstName . " " . $collectionUser->lastName;
                $email    = $collectionUser->email;
                App::setLocale($collectionUser->language);
                $subject = __("textMessageNotify1");
                Mail::send("message.notify", ["text_message" => $message], function ($mail) use (
                    $email,
                    $nickname,
                    $subject
                ) {
                    $mail->to($email, $nickname)->subject($subject);
                    $mail->from(env("MAIL_USERNAME"), "HitBeat Administrator");
                });

                DB::commit();

                Send::dispatch([
                    "id"      => $messageId,
                    "user_id" => $userId,
                    "message" => $message,
                    "date"    => $today,
                    "isRead"  => false,
                ]);
            } catch (\Throwable $e) {
                DB::rollBack();
                Log::error($e);
                return response()->json(["success" => false]);
            }
        }

        return response()->json(["success" => true]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMessage(Request $request): \Illuminate\Http\JsonResponse
    {
        $userId = $request->json()->get("userId");

        if ($userId) {
            $collectionMessage  = DB::table("message_for_user")
                ->select(["id", "created_at", "message"])
                ->where([["user_id", $userId], ["is_read", false]])
                ->orderBy("id")
                ->get();
            $resultArrayMessage = $collectionMessage->toArray();

            return response()->json([
                "success"      => true,
                "arrayMessage" => $resultArrayMessage,
            ]);
        } else {
            return response()->json([
                "success"      => true,
                "arrayMessage" => [],
            ]);
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearMessage(Request $request): \Illuminate\Http\JsonResponse
    {
        $userId = $request->json()->get("userId");

        DB::table("message_for_user")
            ->where("user_id", $userId)
            ->delete();

        return response()->json(["success" => true]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'document.*'  => 'required|max:10000|mimes:doc,docx,pdf',
            'document2.*' => 'required|max:10000|mimes:doc,docx,pdf',
            'currency'    => 'required|',
            'email'       => 'required|email|unique:users,email',
            'firstName'   => 'required|string',
            'lastName'    => 'required|string',
            'password'    => 'required|string',
            'phone'       => 'required',
            'refId' => 'required|integer|exists:users,id'
        ]);

        $totalCurrency = $request->currency;
        $userEmail     = $request->email;
        $mentor     = $request->refId;

        /** @var  User $user */
        $data = $request->except('document', 'document2');
        //  $data['password'] = \Hash::make($data['password']);
        $data['mentor']            = $mentor;
        $data['is_verified_email'] = 1;

        $user = User::create($data);

        if ($request->has('document')) {
            $user->makeDocument($request->file('document'));
        }
        if ($file = $request->file('document2')) {
            $user->makeDocument($file);
        }

        $userRole = Role::where("slug", "user")->first();
        $user->roles()->attach($userRole);

        $user_data = User::where("email", $userEmail)->first();

        DB::table("finance")->insert([
            ["user_id" => $user_data->id, "currency" => "USD", "balance" => 0],
            ["user_id" => $user_data->id, "currency" => "HBM", "balance" => $totalCurrency],
        ]);

        return response()->json(["success" => true, "id" => $user->id]);
    }
}
