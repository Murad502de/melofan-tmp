<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use PragmaRX\Google2FALaravel\Google2FA;

class OperatorController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getUser(Request $request)
	{
		$idUser = $request->json()->get("id");

		$collectionUser = (array) DB::table("users")
			->select([
				"users.id",
				"users.lastName",
				"users.firstName",
				"users.email",
				"users.phone",
				"users.created_at",
				"users.is_blocked",
				"roles.slug as role_id",
			])
			->whereIn("roles.slug", ["payout_operator", "ticket_operator"])
			->where("users.id", $idUser)
			->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
			->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
			->first();

		$collectionUser["role_id"] = parent::getNumberRoleForClient($collectionUser["role_id"]);

		return response()->json([
			"success" => true,
			"user" => $collectionUser,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getUsers(Request $request)
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

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
					case 100:
						$whereFilter[] = ["roles.slug", "ticket_operator"];
						break;
					case 101:
						$whereFilter[] = ["roles.slug", "payout_operator"];
						break;
				}
			}
		}

		$resultArrayUsers = [];
		$countUsers = 0;
		if (empty($search)) {
			$collectionUsers = DB::table("users")
				->select([
					"users.id",
					"users.lastName",
					"users.firstName",
					"users.email",
					"users.phone",
					"users.created_at",
					"users.is_blocked",
					"roles.slug as role_id",
				])
				->whereIn("roles.slug", ["payout_operator", "ticket_operator"])
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
				->whereIn("roles.slug", ["payout_operator", "ticket_operator"])
				->where($whereFilter)
				->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
				->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
				->first();
			$countUsers = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["uses.email", "like", "%" . $search . "%"]],
				2 => [["uses.id", "like", "%" . $search . "%"]],
				3 => [["uses.firstName", "like", "%" . $search . "%"]],
				4 => [["uses.lastName", "like", "%" . $search . "%"]],
				5 => [["uses.phone", "like", "%" . $search . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereFilter, $whereSearch[1]);
			$where[2] = array_merge($whereFilter, $whereSearch[2]);
			$where[3] = array_merge($whereFilter, $whereSearch[3]);
			$where[4] = array_merge($whereFilter, $whereSearch[4]);
			$where[5] = array_merge($whereFilter, $whereSearch[5]);

			$collectionUsers = DB::table("users")
				->select([
					"users.id",
					"users.lastName",
					"users.firstName",
					"users.email",
					"users.phone",
					"users.created_at",
					"users.is_blocked",
					"roles.slug as role_id",
				])
				->whereIn("roles.slug", ["payout_operator", "ticket_operator"])
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->orWhere($where[4])
				->orWhere($where[5])
				->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
				->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
				->orderBy("users.id")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayUsers = $collectionUsers->toArray();

			$collectionCount = DB::table("users")
				->selectRaw("COUNT(users.id) AS countId")
				->whereIn("roles.slug", ["payout_operator", "ticket_operator"])
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->orWhere($where[4])
				->orWhere($where[5])
				->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
				->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
				->first();
			$countUsers = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayUsers,
			"total" => $countUsers,
		]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function addUser(Request $request): \Illuminate\Http\JsonResponse
	{
		$roleId = $request->json()->get("roleId");
		$lastName = $request->json()->get("lastName");
		$firstName = $request->json()->get("firstName");
		$email = $request->json()->get("email");
		$phone = $request->json()->get("phone");
		$password = $request->json()->get("password");
		$password_confirmation = $request->json()->get("password_confirmation");

		if ($password != $password_confirmation) {
			return response()->json(["success" => false]);
		}

		if ($roleId != 100 && $roleId != 101) {
			return response()->json(["success" => false]);
		}
		$roleId = parent::getStringRoleForServer($roleId);

		try {
			DB::beginTransaction();

			$userRole = Role::where("slug", $roleId)->first();

			$user = new User();
			$user->lastName = $lastName;
			$user->firstName = $firstName;
			$user->email = $email;
			$user->password = Hash::make($password);
			$user->phone = $phone;
			$user->is_verified_email = true;
			$user->avatar = \App\Http\Controllers\Auth\UserController::generateAvatar($firstName, $lastName);
			$user->created_at = date("Y-m-d H:i:s");
			$user->save();
			$user->roles()->attach($userRole);

			DB::commit();
		} catch (\Throwable $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}

		return response()->json(["success" => true, "id" => $user->id]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function editUser(Request $request): \Illuminate\Http\JsonResponse
	{
		$user = Auth::user();
		$isEnable2FA = $user->getAttributeValue(env("OTP_ENABLED_COLUMN"));

		//		if (!$isEnable2FA) {
		//			return response()->json(["success" => false, "error" => "Включите двухфакторную аутентификацию!"]);
		//		}
		//		$secret = str_replace(" ", "", $request->input("verifyCode"));
		//		$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);
		//		if (!$valid) {
		//			return response()->json(["success" => false, "error" => "Неверный одноразовый код"]);
		//		}

		$userId = $request->json()->get("id");
		$roleId = $request->json()->get("roleId");
		$lastName = $request->json()->get("lastName");
		$firstName = $request->json()->get("firstName");
		$email = $request->json()->get("email");
		$phone = $request->json()->get("phone");
		$isBlocked = $request->json()->get("is_blocked");

		if ($roleId != 100 && $roleId != 101) {
			return response()->json(["success" => false]);
		}
		$roleId = parent::getStringRoleForServer($roleId);

		$editUser = User::where("id", $userId)->first();
		$userRole = $editUser->roles->first();
		$oldDataUser = [
			"lastName" => $editUser->lastName,
			"firstName" => $editUser->firstName,
			"email" => $editUser->email,
			"phone" => $editUser->phone,
			"is_blocked" => $editUser->is_blocked,
			"role_id" => $userRole->slug,
		];

		$newDataUser = [
			"lastName" => $lastName,
			"firstName" => $firstName,
			"email" => $email,
			"phone" => $phone,
			"is_blocked" => $isBlocked,
			"role_id" => $roleId,
		];

		try {
			DB::beginTransaction();

			$today = date("Y-m-d H:i:s");
			DB::table("edit_user_history")->insert([
				"oldData" => json_encode($oldDataUser),
				"newData" => json_encode($newDataUser),
				"admin_id" => $user->id,
				"created_at" => $today,
			]);
			if ($newDataUser["role_id"] != $oldDataUser["role_id"]) {
				$user->roles()->detach($userRole);

				$userRole = Role::where("slug", $newDataUser["role_id"])->first();
				$user->roles()->attach($userRole);
			}
			unset($newDataUser["role_id"]);

			$editUser->update($newDataUser);

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
	public function destroyUser(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				$editUser = User::where("id", $rowId)->first();
				if (!is_null($editUser)) {
					DB::table("delete_operators")->insert((array) $editUser);
				}
				$editUser->roles()->detach($editUser->roles->first());
				$editUser->delete();

				return response()->json(["success" => true]);
			});
		} catch (\Throwable $e) {
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}
}
