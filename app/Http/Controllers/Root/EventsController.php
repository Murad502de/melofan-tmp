<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventsController extends Controller
{
	private static $idSectionFiles = "events";
	private static $typeFiles = ["pdf", "doc", "docx", "odt", "rtf"];

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getEvents(Request $request): \Illuminate\Http\JsonResponse
	{
		$idEvent = $request->json()->get("id");

		$collectionEvent = DB::table("events")
			->select([
				"events.id",
				"events.title",
				"events.body",
				"events.language",
				"events.created_at",
				"event_files.name",
				"event_files.path",
			])
			->where("events.id", $idEvent)
			->orWhere("events.mainId", $idEvent)
			->leftJoin("event_files", "events.id", "=", "event_files.event_id")
			->get();
		$resultArrayEvents = $collectionEvent->toArray();

		return response()->json([
			"success" => true,
			"array" => $resultArrayEvents,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllEvents(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

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

		$resultArrayEvents = [];
		$countEvents = 0;
		if (empty($search)) {
			$collectionEvents = DB::table("events")
				->select(["id", "title", "body", "language", "created_at"])
				->where($whereFilter)
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayEvents = $collectionEvents->toArray();

			$collectionCount = DB::table("events")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countEvents = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["title", "like", "%" . $search . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);

			$collectionEvents = DB::table("events")
				->select(["id", "title", "body", "language", "created_at"])
				->where($where[1])
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayEvents = $collectionEvents->toArray();

			$collectionCount = DB::table("events")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->first();
			$countEvents = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayEvents,
			"total" => $countEvents,
		]);
	}

	public function changeLanguageEvents(Request $request): \Illuminate\Http\JsonResponse
	{
		$rowId = $request->json()->get("rowId");
		$langId = $request->json()->get("langId");

		$collectionEvents = DB::table("events")
			->select([DB::raw($rowId . " as id"), "title", "body", "language", "created_at"])
			->where([["language", "=", $langId], ["mainId", "=", $rowId]])
			->orWhere([["language", "=", $langId], ["id", "=", $rowId]])
			->first();

		return response()->json([
			"success" => true,
			"events" => $collectionEvents,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function createEvents(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$isSelectedFiles = $request->boolean("isSelectedFiles");
			$today = date("Y-m-d H:i:s");
			$mainId = null;

			for ($index = 0; $index < $countLanguage; $index++) {
				$event = [
					"mainId" => $mainId,
					"title" => $request->get("title" . $index),
					"body" => $request->get("body" . $index),
					"language" => $request->get("languages" . $index),
					"created_at" => $request->get("date"),
					"updated_at" => $today,
				];

				$eventId = DB::table("events")->insertGetId($event);
				if ($index == 0) {
					$mainId = $eventId;
				}
				if ($isSelectedFiles) {
					$file = parent::saveFile($request->file("file" . $index), self::$idSectionFiles, $typeFiles, true);
					$arrayFiles[] = $file;
					DB::table("event_files")->insert([
						"event_id" => $eventId,
						"name" => $request->get("name" . $index),
						"path" => $file["filename"],
						"format" => $file["ext"],
						"size" => $request->get("size" . $index),
					]);
				}
			}

			DB::commit();
			return response()->json(["success" => true]);
		} catch (Exception $e) {
			DB::rollBack();
			$countFiles = count($arrayFiles);
			for ($index = 0; $index < $countFiles; $index++) {
				parent::deleteFile($arrayFiles[$index]["filename"], self::$idSectionFiles);
			}
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function editEvents(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$isSelectedFiles = $request->boolean("isSelectedFiles");
			$isSelectedUrl = $request->boolean("isSelectedUrl");
			$today = date("Y-m-d H:i:s");

			for ($index = 0; $index < $countLanguage; $index++) {
				$eventId = $request->get("id" . $index);
				DB::table("events")
					->where("id", $eventId)
					->update([
						"title" => $request->get("title" . $index),
						"body" => $request->get("body" . $index),
						"language" => $request->get("languages" . $index),
						"created_at" => $request->get("date"),
					]);

				if ($isSelectedFiles || $isSelectedUrl) {
					$file = $request->file("file" . $index);
					if ($file) {
						$file = parent::saveFile($file, self::$idSectionFiles, $typeFiles, true);
						$arrayFiles[] = $file;
						if (
							DB::table("event_files")
								->where("event_id", $eventId)
								->exists()
						) {
							DB::table("event_files")
								->where("event_id", $eventId)
								->update([
									"name" => $request->get("name" . $index),
									"path" => $file["filename"],
									"format" => $file["ext"],
									"size" => $request->get("size" . $index),
								]);
						} else {
							DB::table("event_files")
								->where("event_id", $eventId)
								->insert([
									"event_id" => $eventId,
									"name" => $request->get("name" . $index),
									"path" => $file["filename"],
									"format" => $file["ext"],
									"size" => $request->get("size" . $index),
								]);
						}
					} else {
						DB::table("event_files")
							->where("event_id", $eventId)
							->update([
								"name" => $request->get("name" . $index),
							]);
					}
				}
			}

			DB::commit();
			return response()->json(["success" => true]);
		} catch (Exception $e) {
			DB::rollBack();
			$countFiles = count($arrayFiles);
			for ($index = 0; $index < $countFiles; $index++) {
				parent::deleteFile($arrayFiles[$index]["filename"], self::$idSectionFiles);
			}
			Log::error($e);
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
	public function destroyEvents(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				$collectionEvents = DB::table("events")
					->select(["id"])
					->where("id", $rowId)
					->orWhere("mainId", $rowId)
					->get();
				$collectionEventFiles = DB::table("event_files")
					->select(["path"])
					->whereIn("event_id", $collectionEvents->pluck("id"))
					->get();
				foreach ($collectionEventFiles as $event) {
					parent::deleteFile($event->path, self::$idSectionFiles);
				}

				DB::table("event_files")
					->whereIn("event_id", $collectionEvents->pluck("id"))
					->delete();
				DB::table("events")
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
