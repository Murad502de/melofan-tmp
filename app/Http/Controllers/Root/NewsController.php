<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
	private static $idSectionFiles = "news";
	private static $typeFiles = ["png", "jpe", "jpeg", "jpg", "gif", "bmp", "ico", "tiff", "tif", "svg", "svgz"];

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getNew(Request $request): \Illuminate\Http\JsonResponse
	{
		$idNew = $request->json()->get("id");

		$collectionNews = DB::table("news")
			->select(["id", "language", "announce", "title", "body", "image", "created_at"])
			->where("id", $idNew)
			->orWhere("mainId", $idNew)
			->get();
		$resultArrayNews = self::collectionNewsToArray($collectionNews, true);

		return response()->json([
			"success" => true,
			"array" => $resultArrayNews,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		$resultArrayNews = [];
		$countNews = 0;

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
			$collectionNews = DB::table("news")
				->select(["id", "announce", "title", "body", "image", "language", "created_at"])
				->where($whereFilter)
				->orderBy("created_at", "desc")
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayNews = self::collectionNewsToArray($collectionNews);

			$collectionCount = DB::table("news")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countNews = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["title", "like", "%" . $search . "%"]],
				2 => [["announce", "like", "%" . $search . "%"]],
				3 => [["body", "like", "%" . $search . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);
			$where[2] = array_merge($whereSearch[2], $whereFilter);
			$where[3] = array_merge($whereSearch[3], $whereFilter);

			$collectionNews = DB::table("news")
				->select(["id", "announce", "title", "body", "image", "language", "created_at"])
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->orderBy("created_at", "desc")
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayNews = self::collectionNewsToArray($collectionNews);

			$collectionCount = DB::table("news")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->first();
			$countNews = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayNews,
			"total" => $countNews,
		]);
	}

	/**
	 * @param $collectionNews
	 * @param bool $fullBody
	 * @return array
	 */
	private static function collectionNewsToArray($collectionNews, $fullBody = false): array
	{
		$result = [];
		foreach ($collectionNews as $new) {
			$dataNew = [
				"id" => $new->id,
				"title" => $new->title,
				"announce" => $new->announce,
				"image" => Storage::url($new->image),
				"language" => $new->language,
				"created_at" => $new->created_at,
			];
			if ($fullBody) {
				$dataNew["body"] = $new->body;
			}
			$result[] = $dataNew;
		}

		return $result;
	}

	public function changeLanguageNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$rowId = $request->json()->get("rowId");
		$langId = $request->json()->get("langId");

		$collectionNews = DB::table("news")
			->select(["image", "title", "announce", "language", "created_at", "updated_at"])
			->where([["language", "=", $langId], ["mainId", "=", $rowId]])
			->orWhere([["language", "=", $langId], ["id", "=", $rowId]])
			->first();

		$result = [
			"id" => $rowId,
			"title" => $collectionNews->title,
			"announce" => $collectionNews->announce,
			"image" => Storage::url($collectionNews->image),
			"language" => $collectionNews->language,
			"created_at" => $collectionNews->created_at,
			"updated_at" => $collectionNews->updated_at,
		];

		return response()->json([
			"success" => true,
			"news" => $result,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function createNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$today = date("Y-m-d H:i:s");
			$mainId = null;

			$indexEn = 0;
			for ($index = 0; $index < $countLanguage; $index++) {
				if ($request->get("languages" . $index) == "en") {
					$indexEn = $index;
					break;
				}
			}
			$url = parent::translit($request->get("title" . $indexEn), true, "news", "url");
			if (empty($url)) {
				throw new Exception();
			}

			$isOneFile = (bool) $request->get("isOneFile");
			if ($isOneFile) {
				$fileName = parent::saveFile($request->file("image"), self::$idSectionFiles, self::$typeFiles);
				$arrayFiles[] = $fileName;
			}

			for ($index = 0; $index < $countLanguage; $index++) {
				if (!$isOneFile) {
					$fileName = parent::saveFile(
						$request->file("image" . $index),
						self::$idSectionFiles,
						self::$typeFiles,
					);
					$arrayFiles[] = $fileName;
				}
				$news = [
					"mainId" => $mainId,
					"url" => $url,
					"image" => $fileName,
					"title" => $request->get("title" . $index),
					"announce" => $request->get("announce" . $index),
					"body" => $request->get("body" . $index),
					"language" => $request->get("languages" . $index),
					"created_at" => $request->get("date"),
					"updated_at" => $today,
				];

				if ($index == 0) {
					$mainId = DB::table("news")->insertGetId($news);
				} else {
					DB::table("news")->insert($news);
				}
			}

			DB::commit();
			return response()->json(["success" => true]);
		} catch (Exception $e) {
			DB::rollBack();

			$countFiles = count($arrayFiles);
			for ($index = 0; $index < $countFiles; $index++) {
				parent::deleteFile($arrayFiles[$index], self::$idSectionFiles);
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
	public function editNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		DB::beginTransaction();

		try {
			$countLanguage = $request->get("countLanguage");
			$today = date("Y-m-d H:i:s");

			$indexEn = 0;
			for ($index = 0; $index < $countLanguage; $index++) {
				if ($request->get("languages" . $index) == "en") {
					$indexEn = $index;
					break;
				}
			}
			$url = parent::translit($request->get("title" . $indexEn), true, "news", "url");
			if (empty($url)) {
				throw new Exception();
			}

			for ($index = 0; $index < $countLanguage; $index++) {
				$file = $request->file("image" . $index);

				if (empty($file)) {
					$news = [
						"url" => $url,
						"title" => $request->get("title" . $index),
						"announce" => $request->get("announce" . $index),
						"body" => $request->get("body" . $index),
						"language" => $request->get("languages" . $index),
						"created_at" => $request->get("date"),
					];
				} else {
					$fileName = parent::saveFile($file, self::$idSectionFiles, self::$typeFiles);
					$arrayFiles[] = $fileName;
					$news = [
						"url" => $url,
						"image" => $fileName,
						"title" => $request->get("title" . $index),
						"announce" => $request->get("announce" . $index),
						"body" => $request->get("body" . $index),
						"language" => $request->get("languages" . $index),
						"created_at" => $request->get("date"),
					];
				}

				DB::table("news")
					->where("id", $request->get("id" . $index))
					->update($news);
			}

			DB::commit();
			return response()->json(["success" => true]);
		} catch (Exception $e) {
			DB::rollBack();
			$countFiles = count($arrayFiles);
			for ($index = 0; $index < $countFiles; $index++) {
				parent::deleteFile($arrayFiles[$index], self::$idSectionFiles);
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
	public function destroyNews(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				$collectionNews = DB::table("news")
					->select("image")
					->where("id", $rowId)
					->orWhere("mainId", $rowId)
					->get();
				foreach ($collectionNews as $new) {
					parent::deleteFile($new->image, self::$idSectionFiles);
				}
				DB::table("news")
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
