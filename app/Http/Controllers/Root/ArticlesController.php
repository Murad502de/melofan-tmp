<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticlesController extends Controller
{
	private static $idSectionFiles = "articles";
	private static $typeFiles = ["png", "jpe", "jpeg", "jpg", "gif", "bmp", "ico", "tiff", "tif", "svg", "svgz"];

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getArticle(Request $request): \Illuminate\Http\JsonResponse
	{
		$idArticle = $request->json()->get("id");

		$collectionArticles = DB::table("articles")
			->select(["id", "language", "announce", "title", "body", "image", "created_at"])
			->where("id", $idArticle)
			->orWhere("mainId", $idArticle)
			->get();
		$resultArrayArticles = self::collectionArticlesToArray($collectionArticles, true);

		return response()->json([
			"success" => true,
			"array" => $resultArrayArticles,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getArticles(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		$resultArrayArticles = [];
		$countArticles = 0;

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
			$collectionArticles = DB::table("articles")
				->select(["id", "announce", "title", "body", "image", "language", "created_at"])
				->where($whereFilter)
				->orderBy("created_at", "desc")
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayArticles = self::collectionArticlesToArray($collectionArticles);

			$collectionCount = DB::table("articles")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countArticles = $collectionCount->countId;
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

			$collectionArticles = DB::table("articles")
				->select(["id", "announce", "title", "body", "image", "language", "created_at"])
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->orderBy("created_at", "desc")
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayArticles = self::collectionArticlesToArray($collectionArticles);

			$collectionCount = DB::table("articles")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->first();
			$countArticles = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayArticles,
			"total" => $countArticles,
		]);
	}

	/**
	 * @param $collectionArticles
	 * @param bool $fullBody
	 * @return array
	 */
	private static function collectionArticlesToArray($collectionArticles, $fullBody = false): array
	{
		$result = [];
		foreach ($collectionArticles as $article) {
			$dataArticle = [
				"id" => $article->id,
				"title" => $article->title,
				"announce" => $article->announce,
				"image" => Storage::url($article->image),
				"language" => $article->language,
				"created_at" => $article->created_at,
			];
			if ($fullBody) {
				$dataArticle["body"] = $article->body;
			}
			$result[] = $dataArticle;
		}

		return $result;
	}

	public function changeLanguageArticles(Request $request): \Illuminate\Http\JsonResponse
	{
		$rowId = $request->json()->get("rowId");
		$langId = $request->json()->get("langId");

		$collectionArticles = DB::table("articles")
			->select(["image", "title", "announce", "language", "created_at", "updated_at"])
			->where([["language", "=", $langId], ["mainId", "=", $rowId]])
			->orWhere([["language", "=", $langId], ["id", "=", $rowId]])
			->first();

		$result = [
			"id" => $rowId,
			"title" => $collectionArticles->title,
			"announce" => $collectionArticles->announce,
			"image" => Storage::url($collectionArticles->image),
			"language" => $collectionArticles->language,
			"created_at" => $collectionArticles->created_at,
			"updated_at" => $collectionArticles->updated_at,
		];

		return response()->json([
			"success" => true,
			"articles" => $result,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function createArticles(Request $request): \Illuminate\Http\JsonResponse
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
			$url = parent::translit($request->get("title" . $indexEn), true, "articles", "url");
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
				$articles = [
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
					$mainId = DB::table("articles")->insertGetId($articles);
				} else {
					DB::table("articles")->insert($articles);
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
	public function editArticles(Request $request): \Illuminate\Http\JsonResponse
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
			$url = parent::translit($request->get("title" . $indexEn), true, "articles", "url");
			if (empty($url)) {
				throw new Exception();
			}

			for ($index = 0; $index < $countLanguage; $index++) {
				$file = $request->file("image" . $index);

				if (empty($file)) {
					$articles = [
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
					$articles = [
						"url" => $url,
						"image" => $fileName,
						"title" => $request->get("title" . $index),
						"announce" => $request->get("announce" . $index),
						"body" => $request->get("body" . $index),
						"language" => $request->get("languages" . $index),
						"created_at" => $request->get("date"),
					];
				}

				DB::table("articles")
					->where("id", $request->get("id" . $index))
					->update($articles);
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
	public function destroyArticles(Request $request): \Illuminate\Http\JsonResponse
	{
		try {
			return DB::transaction(function () use ($request) {
				$rowId = $request->json()->get("rowId");
				$collectionArticles = DB::table("articles")
					->select("image")
					->where("id", $rowId)
					->orWhere("mainId", $rowId)
					->get();
				foreach ($collectionArticles as $article) {
					parent::deleteFile($article->image, self::$idSectionFiles);
				}
				DB::table("articles")
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
