<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentsController extends Controller
{
	private static $idSectionFiles = "documents";
	private static $typeFiles = ["pdf", "doc", "docx", "odt", "rtf"];
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getDocuments(Request $request): \Illuminate\Http\JsonResponse
	{
		$idDocument = $request->json()->get("id");

		$collectionDocuments = DB::table("documents")
			->select([
				"id",
				"name",
				"format",
				"size",
				"path",
				"isDisplay",
				"url_confirmation as urlConfirm",
				"language",
			])
			->where("id", $idDocument)
			->orWhere("mainId", $idDocument)
			->get();
		$resultArrayDocuments = $collectionDocuments->toArray();

		return response()->json([
			"success" => true,
			"array" => $resultArrayDocuments,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllDocuments(Request $request): \Illuminate\Http\JsonResponse
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

		$resultArrayDocuments = [];
		$countDocuments = 0;
		if (empty($search)) {
			$collectionDocuments = DB::table("documents")
				->select(["id", "name", "format", "size", "language", "isDisplay", "url_confirmation as urlConfirm"])
				->where($whereFilter)
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayDocuments = $collectionDocuments->toArray();

			$collectionCount = DB::table("documents")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countDocuments = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["name", "like", "%" . $search . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);

			$collectionDocuments = DB::table("documents")
				->select(["id", "name", "format", "size", "language", "isDisplay", "url_confirmation as urlConfirm"])
				->where($where[1])
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayDocuments = $collectionDocuments->toArray();

			$collectionCount = DB::table("documents")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->first();
			$countDocuments = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayDocuments,
			"total" => $countDocuments,
		]);
	}

	public function changeLanguageDocuments(Request $request): \Illuminate\Http\JsonResponse
	{
		$rowId = $request->json()->get("rowId");
		$langId = $request->json()->get("langId");

		$collectionDocuments = DB::table("documents")
			->select([
				DB::raw($rowId . " as id"),
				"name",
				"format",
				"size",
				"language",
				"isDisplay",
				"url_confirmation as urlConfirm",
			])
			->where([["language", "=", $langId], ["mainId", "=", $rowId]])
			->orWhere([["language", "=", $langId], ["id", "=", $rowId]])
			->first();

		return response()->json([
			"success" => true,
			"documents" => $collectionDocuments,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function createDocuments(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$today = date("Y-m-d H:i:s");
			$mainId = null;
			$dataFile = null;

			$isOneFile = $request->boolean("isOneFile");

			if ($isOneFile) {
				$file = parent::saveFile($request->file("file"), self::$idSectionFiles, self::$typeFiles, true);
				$size = $request->get("size");
				$arrayFiles[] = $file;
			}

			for ($index = 0; $index < $countLanguage; $index++) {
				if (!$isOneFile) {
					$file = parent::saveFile(
						$request->file("file" . $index),
						self::$idSectionFiles,
						self::$typeFiles,
						true,
					);
					$size = $request->get("size" . $index);
					$arrayFiles[] = $file;
				}

				$documents = [
					"mainId" => $mainId,
					"name" => $request->get("name" . $index),
					"format" => $file["ext"],
					"size" => $size,
					"path" => $file["filename"],
					"language" => $request->get("languages" . $index),
					"isDisplay" => $request->boolean("isDisplay"),
					"url_confirmation" => $request->get("urlConfirm"),
					"created_at" => $today,
					"updated_at" => $today,
				];

				if ($index == 0) {
					$mainId = DB::table("documents")->insertGetId($documents);
				} else {
					DB::table("documents")->insert($documents);
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
	public function editDocuments(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$today = date("Y-m-d H:i:s");

			for ($index = 0; $index < $countLanguage; $index++) {
				$file = $request->file("file" . $index);
				$size = $request->get("size" . $index);

				if (empty($file)) {
					$documents = [
						"name" => $request->get("name" . $index),
						"language" => $request->get("languages" . $index),
						"isDisplay" => $request->boolean("isDisplay"),
						"url_confirmation" => $request->get("urlConfirm"),
						"updated_at" => $today,
					];
				} else {
					$file = parent::saveFile($file, self::$idSectionFiles, self::$typeFiles, true);
					$arrayFiles[] = $file;
					$documents = [
						"name" => $request->get("name" . $index),
						"format" => $file["ext"],
						"path" => $file["filename"],
						"size" => $size,
						"language" => $request->get("languages" . $index),
						"isDisplay" => $request->boolean("isDisplay"),
						"url_confirmation" => $request->boolean("urlConfirm"),
						"updated_at" => $today,
					];
				}

				DB::table("documents")
					->where("id", $request->get("id" . $index))
					->update($documents);
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
	public function destroyDocuments(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				$collectionDocuments = DB::table("documents")
					->select("path")
					->where("id", $rowId)
					->orWhere("mainId", $rowId)
					->get();
				foreach ($collectionDocuments as $documents) {
					parent::deleteFile($documents->path, self::$idSectionFiles);
				}
				DB::table("documents")
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
