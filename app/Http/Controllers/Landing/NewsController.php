<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
	public function getNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$language = $request->json()->get("language");
		$currentPage = $request->json()->get("currentPage");

		$collectionNews = DB::table("news")
			->select(["id", "url", "image", "title", "announce", "created_at"])
			->where("language", $language)
			->orderBy("created_at", "desc")
			->skip(($currentPage - 1) * 20)
			->take(20)
			->get();

		$resultNews = [];
		foreach ($collectionNews as $news) {
			$resultNews[] = [
				"id" => $news->id,
				"url" => $news->url,
				"date" => $news->created_at,
				"title" => $news->title,
				"announce" => $news->announce,
				"image" => Storage::url($news->image),
			];
		}

		return response()->json([
			"success" => true,
			"arrayNews" => $resultNews,
		]);
	}

	public function getOneNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$url = $request->json()->get("url");
		$language = $request->json()->get("language");

		if (!isset($url) || empty($url)) {
			return response()->json(["success" => false], 404);
		}

		$collectionNews = DB::table("news")
			->select(["id", "image", "body", "title", "announce", "created_at"])
			->where([["url", $url], ["language", $language]])
			->first();

		if (is_null($collectionNews)) {
			$selectItem = $language == "en" ? "id" : "main_id";
			$collectionNews = DB::table("news")
				->select([$selectItem])
				->where("url", $url)
				->first();

			if (is_null($collectionNews)) {
				return response()->json(["success" => false], 404);
			} else {
				$collectionNews = DB::table("news")
					->select(["id", "image", "body", "title", "announce", "created_at"])
					->where([["id", $collectionNews->getAttributeValue($selectItem)], ["language", $language]])
					->orWhere([["main_id", $collectionNews->getAttributeValue($selectItem)], ["language", $language]])
					->first();
			}
		}

		if (is_null($collectionNews)) {
			return response()->json(["success" => false], 404);
		}

		$collectionActualNews = DB::table("news")
			->select(["id", "url", "image", "title", "announce", "created_at"])
			->where([["language", $language], ["id", "!=", $collectionNews->id]])
			->take(4)
			->orderBy("created_at", "desc")
			->get();

		$actualNews = [];
		foreach ($collectionActualNews as $news) {
			$actualNews[] = [
				"id" => $news->id,
				"url" => $news->url,
				"date" => $news->created_at,
				"title" => $news->title,
				"announce" => $news->announce,
				"image" => Storage::url($news->image),
			];
		}

		return response()->json([
			"success" => true,
			"image" => Storage::url($collectionNews->image),
			"title" => $collectionNews->title,
			"announce" => $collectionNews->announce,
			"body" => $collectionNews->body,
			"date" => $collectionNews->created_at,
			"actualNews" => $actualNews,
		]);
	}

	public function getCountNews(Request $request): \Illuminate\Http\JsonResponse
	{
		$language = $request->json()->get("language");
		$collectionCount = DB::table("news")
			->selectRaw("COUNT(id) AS countId")
			->where("language", $language)
			->first();
		$countNews = $collectionCount->countId;

		return response()->json([
			"success" => true,
			"countNews" => $countNews,
		]);
	}
}
