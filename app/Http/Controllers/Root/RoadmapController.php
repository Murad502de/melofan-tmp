<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoadmapController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getRoadmap(Request $request): \Illuminate\Http\JsonResponse
	{
		$idRoadmap = $request->json()->get("idRoadmap");

		$collectionRoadmap = DB::table("roadmap")
			->select([
				"id",
				"language",
				"title",
				"round",
				"target",
				"status",
				"amount",
				"percentCalc",
				"isDisplay",
				"typeTime",
				"created_at",
				"updated_at",
				"month",
				"quarter",
				"year",
			])
			->where("id", $idRoadmap)
			->orWhere("mainId", $idRoadmap)
			->get();
		$resultArrayRoadmap = self::collectionRoadmapToArray($collectionRoadmap, true);

		return response()->json([
			"success" => true,
			"array" => $resultArrayRoadmap,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllRoadmap(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		$resultArrayRoadmap = [];
		$countRoadmap = 0;

		$whereFilter = [];
		if ($filter) {
			if (isset($filter["language"]) && !empty($filter["language"]) && $filter["language"]["isActive"]) {
				switch ((string) $filter["language"]["select"]) {
					case "ru":
						$whereFilter[] = ["language", "ru"];
						break;
					case "en":
						$whereFilter[] = ["language", "en"];
						break;
				}
			} else {
				$whereFilter[] = ["language", "ru"];
			}
		}

		if (empty($search)) {
			$collectionRoadmap = DB::table("roadmap")
				->select([
					"id",
					"title",
					"round",
					"target",
					"status",
					"amount",
					"percentCalc",
					"language",
					"isDisplay",
					"typeTime",
					"updated_at",
					"month",
					"quarter",
					"year",
				])
				->where($whereFilter)
				->orderBy("updated_at", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayRoadmap = self::collectionRoadmapToArray($collectionRoadmap);

			$collectionCount = DB::table("roadmap")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countRoadmap = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["title", "like", "%" . $search . "%"]],
				2 => [["target", "like", "%" . $search . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);
			$where[2] = array_merge($whereSearch[2], $whereFilter);

			$collectionRoadmap = DB::table("roadmap")
				->select([
					"id",
					"title",
					"round",
					"target",
					"status",
					"amount",
					"percentCalc",
					"language",
					"isDisplay",
					"typeTime",
					"updated_at",
					"month",
					"quarter",
					"year",
				])
				->where($where[1])
				->orWhere($where[2])
				->orderBy("updated_at", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayRoadmap = self::collectionRoadmapToArray($collectionRoadmap);

			$collectionCount = DB::table("roadmap")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->orWhere($where[2])
				->first();
			$countRoadmap = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayRoadmap,
			"total" => $countRoadmap,
		]);
	}

	/**
	 * @param $collectionRoadmap
	 * @param bool $isFull
	 * @return array
	 */
	private static function collectionRoadmapToArray($collectionRoadmap, $isFull = false): array
	{
		$result = [];
		foreach ($collectionRoadmap as $roadmap) {
			$dataRoadMap = [
				"id" => $roadmap->id,
				"title" => $roadmap->title,
				"round" => $roadmap->round,
				"target" => $roadmap->target,
				"status" => $roadmap->status,
				"amount" => $roadmap->amount,
				"percent" => $roadmap->percentCalc,
				"isDisplay" => $roadmap->isDisplay,
				"language" => $roadmap->language,
				"updated_at" => $roadmap->updated_at,
				"typeTime" => $roadmap->typeTime,
				"month" => $roadmap->month,
				"quarter" => $roadmap->quarter,
				"year" => $roadmap->year,
			];
			if ($isFull) {
				$dataRoadMap["percentCalc"] = $roadmap->percentCalc;
				$dataRoadMap["typeTime"] = $roadmap->typeTime;
				$dataRoadMap["created_at"] = $roadmap->created_at;
			}
			$result[] = $dataRoadMap;
		}

		return $result;
	}

	public function changeLanguageRoadmap(Request $request): \Illuminate\Http\JsonResponse
	{
		$rowId = $request->json()->get("rowId");
		$langId = $request->json()->get("langId");

		$collectionRoadmap = DB::table("roadmap")
			->select([
				"id",
				"title",
				"round",
				"target",
				"status",
				"amount",
				"isDisplay",
				"typeTime",
				"updated_at",
				"month",
				"quarter",
				"year",
			])
			->where([["language", "=", $langId], ["mainId", "=", $rowId]])
			->orWhere([["language", "=", $langId], ["id", "=", $rowId]])
			->first();
		$result = (array) $collectionRoadmap;
		$result["id"] = $rowId;

		return response()->json([
			"success" => true,
			"roadmap" => $result,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function createRoadmap(Request $request): \Illuminate\Http\JsonResponse
	{
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$today = date("Y-m-d H:i:s");
			$mainId = null;

			$dataForBroadcast = [];

			for ($index = 0; $index < $countLanguage; $index++) {
				$language = $request->get("languages" . $index);
				$dataForBroadcast[$language] = [
					"mainId" => $mainId,
					"title" => $request->get("title" . $index),
					"round" => $request->get("round"),
					"target" => $request->get("target" . $index),
					"status" => $request->get("status"),
					"amount" => $request->get("amount"),
					"percentCalc" => $request->get("percentCalc"),
					"isDisplay" => $request->get("isDisplay") == "true",
					"typeTime" => $request->get("typeTime"),
					"language" => $language,
					"created_at" => $today,
					"month" => $request->get("month"),
					"quarter" => $request->get("quarter"),
					"year" => $request->get("year"),
				];
				if ($request->get("updated_at") != "null") {
					$dataForBroadcast[$language]["updated_at"] = $request->get("updated_at");
				}

				if ($index == 0) {
					$mainId = DB::table("roadmap")->insertGetId($dataForBroadcast[$language]);
				} else {
					DB::table("roadmap")->insert($dataForBroadcast[$language]);
				}
			}

			DB::commit();

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
	public function editRoadmap(Request $request): \Illuminate\Http\JsonResponse
	{
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$today = date("Y-m-d H:i:s");

			for ($index = 0; $index < $countLanguage; $index++) {
				$roadmap = [
					"title" => $request->get("title" . $index),
					"round" => $request->get("round"),
					"target" => $request->get("target" . $index),
					"status" => $request->get("status"),
					"amount" => $request->get("amount"),
					"percentCalc" => $request->get("percentCalc"),
					"isDisplay" => $request->get("isDisplay") == "true",
					"typeTime" => $request->get("typeTime"),
					"language" => $request->get("languages" . $index),
					"created_at" => $today,
					"month" => $request->get("month"),
					"quarter" => $request->get("quarter"),
					"year" => $request->get("year"),
				];
				if ($request->get("updated_at") != "null") {
					$roadmap["updated_at"] = $request->get("updated_at");
				}
				DB::table("roadmap")
					->where("id", $request->get("id" . $index))
					->update($roadmap);
			}

			DB::commit();
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
	public function destroyRoadmap(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				DB::table("roadmap")
					->where("id", $rowId)
					->orWhere("mainId", $rowId)
					->delete();
				return response()->json(["success" => true]);
			});
		} catch (Exception $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}
}
