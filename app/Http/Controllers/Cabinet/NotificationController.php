<?php

namespace App\Http\Controllers\Cabinet;

use App\Events\Notifications\Read;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
	/**
	 * @var string[]
	 */
	private static $mapNameTable = [
		"date" => "created_at",
		"message" => "message",
	];

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllNotification(Request $request): \Illuminate\Http\JsonResponse
	{
		$userId = auth()->user()->id;
		$dataRequest = $request->json()->all();

		if (!parent::verifyTableId($request["tableId"])) {
			return response()->json(["success" => false]);
		}

		if ($dataRequest["isFirstLoad"]) {
			$dataRequest = parent::getProcessedData($userId, $dataRequest);
			$response = $dataRequest["response"];
			$dataRequest = $dataRequest["request"];
		}

		$whereForTable = parent::getWhereDateForTable(
			$userId,
			$dataRequest["tableId"],
			"created_at",
			$dataRequest["typeDateFilter"],
			$dataRequest["dateBegin"],
			$dataRequest["dataEnd"],
		);
		$orWhereForTable = $whereForTable;
		$orWhereForTable[] = ["user_id", 0];
		$whereForTable[] = ["user_id", $userId];

		$cellSort = self::$mapNameTable[$dataRequest["idCellSort"]];
		$sortAsc = parent::getSortAscForTable(
			$userId,
			$dataRequest["tableId"],
			$dataRequest["sortAsc"],
			$dataRequest["idCellSort"],
		);

		$collectionTickets = DB::table("message_for_user")
			->select([
				"id",
				"message",
				DB::raw("(is_read OR (view_users IS NOT NULL AND view_users LIKE '%." . $userId . ".%')) as isRead"),
				"created_at as date",
			])
			->where($whereForTable)
			->orWhere($orWhereForTable)
			->skip(($dataRequest["currentPage"] - 1) * $dataRequest["countPerPage"])
			->take($dataRequest["countPerPage"])
			->orderBy($cellSort, $sortAsc)
			->get();

		$response["success"] = true;
		$response["rows"] = $collectionTickets->toArray();
		$response["count"] = DB::table("message_for_user")
			->where($whereForTable)
			->orWhere($orWhereForTable)
			->count();

		DB::table("message_for_user")
			->where($whereForTable)
			->orWhere($orWhereForTable)
			->skip(($dataRequest["currentPage"] - 1) * $dataRequest["countPerPage"])
			->take($dataRequest["countPerPage"])
			->orderBy($cellSort, $sortAsc)
			->update([
				"is_read" => DB::raw("IF(user_id=0, 0, 1)"),
				"view_users" => DB::raw(
					"IF(view_users LIKE '%." . $userId . ".%', view_users, CONCAT(view_users, '" . $userId . ".'))",
				),
			]);

		Read::dispatch($userId, $collectionTickets->pluck("id"));

		return response()->json($response);
	}

	public function getTodayNotification(Request $request): \Illuminate\Http\JsonResponse
	{
		$userId = auth()->user()->id;

		$collectionMessages = DB::table("message_for_user")
			->select([
				"id",
				"message",
				DB::raw("(is_read OR (view_users IS NOT NULL AND view_users LIKE '%." . $userId . ".%')) as isRead"),
				"created_at as date",
			])
			->where([
				["user_id", $userId],
				["created_at", ">", date("Y-m-d 00:00:00")],
				["created_at", "<", date("Y-m-d 23:59:59")],
			])
			->orWhere([
				["user_id", 0],
				["created_at", ">", date("Y-m-d 00:00:00")],
				["created_at", "<", date("Y-m-d 23:59:59")],
			])
			->orWhere([["user_id", $userId], ["is_read", false]])
			->orWhere([["user_id", 0], ["view_users", "NOT LIKE", "%." . $userId . ".%"]])
			->orderBy("date", "desc")
			->get();

		return response()->json([
			"success" => true,
			"messages" => $collectionMessages->toArray(),
			"isReadMessages" => !DB::table("message_for_user")
				->where([["user_id", $userId], ["is_read", false]])
				->orWhere([["user_id", 0], ["view_users", "NOT LIKE", "%." . $userId . ".%"]])
				->exists(),
		]);
	}
}
