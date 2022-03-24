<?php

namespace App\Http\Controllers\Root;

use App\Events\Securities\Create;
use App\Events\Securities\Delete;
use App\Events\Securities\Edit;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SecuritiesController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getSecurities(Request $request): \Illuminate\Http\JsonResponse
	{
		$id = $request->json()->get("id");
		$collectionRoadmap = DB::table("securities")
			->select([
				"id",
				"round",
				"targetAmount",
				"price",
				"status",
				"targetPercent",
				"created_at",
				"updated_at",
				"resultAmount",
				"resultPercent",
				"resultMLFN",
				"targetMLFN",
			])
			->where("id", $id)
			->first();

		return response()->json([
			"success" => true,
			"securities" => $collectionRoadmap,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllSecurities(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		$whereFilter = [];
		if ($filter) {
			//			if (isset($filter["language"]) && !empty($filter["language"]) && $filter["language"]["isActive"]) {
			//				switch ((string) $filter["language"]["select"]) {
			//					case "ru":
			//						$whereFilter[] = ["language", "ru"];
			//						break;
			//					case "en":
			//						$whereFilter[] = ["language", "en"];
			//						break;
			//				}
			//			} else {
			//				$whereFilter[] = ["language", "ru"];
			//			}
		}

		$td = [
			"id",
			"created_at",
			"updated_at",
			"round",
			"status",
			"targetAmount",
			"targetMLFN",
			"price",
			"targetPercent",
			"resultAmount",
			"resultPercent",
			"resultMLFN",
		];

		if (empty($search)) {
			$collectionSecurities = DB::table("securities")
				->select($td)
				->where($whereFilter)
				->orderBy("created_at", "desc")
				->orderBy("updated_at", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();

			$collectionCount = DB::table("securities")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
		} else {
			$whereSearch = [
				1 => [["targetAmount", "like", "%" . $search . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);

			$collectionSecurities = DB::table("securities")
				->select([$td])
				->where($where[1])
				->orderBy("created_at", "desc")
				->orderBy("updated_at", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();

			$collectionCount = DB::table("securities")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->first();
		}

		return response()->json([
			"success" => true,
			"array" => $collectionSecurities->toArray(),
			"total" => $collectionCount->countId,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function createSecurities(Request $request): \Illuminate\Http\JsonResponse
	{
		DB::beginTransaction();

		try {
			$dataForBroadcast = [
				"round" => $request->get("round"),
				"targetAmount" => $request->get("targetAmount"),
				"status" => $request->get("status"),
				"price" => $request->get("price"),
				"targetPercent" => $request->get("targetPercent"),
				"targetMLFN" => $request->get("targetMLFN"),
				"created_at" => $request->get("created_at"),
				"updated_at" => $request->get("updated_at"),
			];

			$mainId = DB::table("securities")->insertGetId($dataForBroadcast);
			DB::commit();

			$dataForBroadcast["id"] = $mainId;
			$dataForBroadcast["resultAmount"] = 0;
			$dataForBroadcast["resultPercent"] = 0;
			$dataForBroadcast["resultMLFN"] = 0;
			Create::dispatch($dataForBroadcast);

			return response()->json(["success" => true]);
		} catch (Exception $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function editSecurities(Request $request): \Illuminate\Http\JsonResponse
	{
		DB::beginTransaction();

		try {
			$id = $request->get("id");
			$dataForBroadcast = [
				"round" => $request->get("round"),
				"targetAmount" => $request->get("targetAmount"),
				"status" => $request->get("status"),
				"price" => $request->get("price"),
				"targetPercent" => $request->get("targetPercent"),
				"targetMLFN" => $request->get("targetMLFN"),
				"created_at" => $request->get("created_at"),
				"updated_at" => $request->get("updated_at"),
			];

			DB::table("securities")
				->where("id", $id)
				->update($dataForBroadcast);

			DB::commit();

			$dataForBroadcast["id"] = $id;
			$collectionResult = DB::table("securities")
				->select(["resultAmount", "resultPercent", "resultMLFN"])
				->where("id", $id)
				->first();
			$dataForBroadcast["resultAmount"] = $collectionResult->resultAmount;
			$dataForBroadcast["resultPercent"] = $collectionResult->resultPercent;
			$dataForBroadcast["resultMLFN"] = $collectionResult->resultMLFN;
			Edit::dispatch($dataForBroadcast);

			return response()->json(["success" => true]);
		} catch (Exception $e) {
			DB::rollBack();
			return response()->json(["success" => false]);
		}
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function destroySecurities(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				$isResult = DB::table("securities")
					->where([["id", $rowId], ["resultAmount", ">", 0]])
					->exists();
				if ($isResult) {
					return response()->json(["success" => false, "error" => 2]);
				} else {
					DB::table("securities")
						->where("id", $rowId)
						->delete();
				}

				Delete::dispatch($rowId);

				return response()->json(["success" => true]);
			});
		} catch (Exception $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}
}
