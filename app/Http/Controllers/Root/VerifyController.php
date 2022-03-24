<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class VerifyController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getUser(Request $request): \Illuminate\Http\JsonResponse
	{
		$idUser = $request->json()->get("idUser");

		$collectionUser = DB::table("users")
			->select([
				"users.id",
				"users.lastName",
				"users.firstName",
				"users.email",
				"users.phone",
				"users.created_at",
				"users.language",
				"countries.name as country",
				"regions.nameAscii as region",
				"cities.nameAscii as city",
			])
			->whereIn("roles.slug", ["broker", "user"])
			->whereIn("users.statusKYC", [3, 5])
			->where([["users.id", $idUser], ["users.stepKYC", 3]])
			->leftJoin("users_roles", "users.id", "=", "users_roles.user_id")
			->leftJoin("roles", "users_roles.role_id", "=", "roles.id")
			->leftJoin("countries", "users.country", "=", "countries.iso")
			->leftJoin("regions", function ($join) {
				$join->whereRaw('regions.code LIKE CONCAT(users.country,\'.\', users.region)');
			})
			->leftJoin("cities", "users.city", "=", "cities.id")
			->first();

		if (is_null($collectionUser)) {
			return response()->json(["success" => false], 401);
		}

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
	public function getUsers(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		$whereFilter = [["users.stepKYC", 3]];
		if ($filter) {
			if (isset($filter["country"]) && !empty($filter["country"]) && $filter["country"]["isActive"]) {
				switch ((string) $filter["country"]["select"]) {
					case "US":
						$whereFilter[] = ["users.country", "US"];
						break;
					case "CA":
						$whereFilter[] = ["users.country", "CA"];
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
				])
				->whereIn("roles.slug", ["broker", "user"])
				->whereIn("users.statusKYC", [3, 5])
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
				->whereIn("users.statusKYC", [3, 5])
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
				])
				->whereIn("roles.slug", ["broker", "user"])
				->whereIn("users.statusKYC", [3, 5])
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
				->whereIn("users.statusKYC", [3, 5])
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
	public function applyVerify(Request $request): \Illuminate\Http\JsonResponse
	{
		$userId = $request->json()->get("id");

		try {
			DB::beginTransaction();

			$isExists = DB::table("users")
				->whereIn("users.statusKYC", [3, 5])
				->where([["users.id", $userId], ["users.stepKYC", 3]])
				->exists();

			if ($isExists) {
				DB::table("users")
					->where("id", $userId)
					->update(["stepKYC" => 0]);
			} else {
				throw new \Exception();
			}

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
	public function cancelVerify(Request $request): \Illuminate\Http\JsonResponse
	{
		$userId = $request->json()->get("id");
		$messageForUser = $request->json()->get("messageForUser");
		$today = date("Y-m-d H:i:s");

		if (!$messageForUser || empty($messageForUser)) {
			return response()->json(["success" => false]);
		}

		try {
			DB::beginTransaction();

			$collectionUser = DB::table("users")
				->select(["firstName", "lastName", "email", "language"])
				->whereIn("users.statusKYC", [3, 5])
				->where([["users.id", $userId], ["users.stepKYC", 3]])
				->first();

			if (!is_null($collectionUser)) {
				DB::table("message_for_user")->insert([
					"user_id" => $userId,
					"message" => $messageForUser,
					"created_at" => $today,
				]);
				DB::table("users")
					->where("id", $userId)
					->update(["stepKYC" => 4]);

				$nickname = $collectionUser->firstName . " " . $collectionUser->lastName;
				$email = $collectionUser->email;
				App::setLocale($collectionUser->language);
				$subject = __("textMessageNotify1");
				Mail::send("message.notify", ["text_message" => $messageForUser], function ($mail) use (
					$email,
					$nickname,
					$subject
				) {
					$mail->to($email, $nickname)->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat Administrator");
				});
			} else {
				throw new \Exception();
			}

			DB::commit();
		} catch (\Throwable $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}

		return response()->json(["success" => true]);
	}
}
