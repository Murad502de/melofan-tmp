<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ArticlesController extends Controller
{
	public function getArticles(Request $request)
	{
		$language = $request->json()->get("language");
		$currentPage = $request->json()->get("currentPage");

		$collectionArticles = DB::table("articles")
			->select(["id", "url", "image", "title", "announce", "created_at"])
			->where("language", $language)
			->orderBy("created_at", "desc")
			->skip(($currentPage - 1) * 20)
			->take(20)
			->get();

		$resultArticles = [];
		foreach ($collectionArticles as $articles) {
			$resultArticles[] = [
				"id" => $articles->id,
				"url" => $articles->url,
				"date" => $articles->created_at,
				"title" => $articles->title,
				"announce" => $articles->announce,
				"image" => Storage::url($articles->image),
			];
		}

		return response()->json([
			"success" => true,
			"arrayArticles" => $resultArticles,
		]);
	}

	public function getOneArticles(Request $request)
	{
		$url = $request->json()->get("url");
		$language = $request->json()->get("language");

		if (!isset($url) || empty($url)) {
			return response()->json(["success" => false], 404);
		}

		$collectionArticles = DB::table("articles")
			->select(["id", "image", "body", "title", "announce", "created_at"])
			->where([["url", $url], ["language", $language]])
			->first();

		if (is_null($collectionArticles)) {
			$selectItem = $language == "en" ? "id" : "main_id";
			$collectionArticles = DB::table("articles")
				->select([$selectItem])
				->where("url", $url)
				->first();

			if (is_null($collectionArticles)) {
				return response()->json(["success" => false], 404);
			} else {
				$collectionArticles = DB::table("articles")
					->select(["id", "image", "body", "title", "announce", "created_at"])
					->where([["id", $collectionArticles->getAttributeValue($selectItem)], ["language", $language]])
					->orWhere([
						["main_id", $collectionArticles->getAttributeValue($selectItem)],
						["language", $language],
					])
					->first();
			}
		}

		if (is_null($collectionArticles)) {
			return response()->json(["success" => false], 404);
		}

		$collectionActualArticles = DB::table("articles")
			->select(["id", "url", "image", "title", "announce", "created_at"])
			->where([["language", $language], ["id", "!=", $collectionArticles->id]])
			->take(4)
			->orderBy("created_at", "desc")
			->get();

		$actualArticles = [];
		foreach ($collectionActualArticles as $articles) {
			$actualArticles[] = [
				"id" => $articles->id,
				"url" => $articles->url,
				"date" => $articles->created_at,
				"title" => $articles->title,
				"announce" => $articles->announce,
				"image" => Storage::url($articles->image),
			];
		}

		return response()->json([
			"success" => true,
			"image" => Storage::url($collectionArticles->image),
			"title" => $collectionArticles->title,
			"announce" => $collectionArticles->announce,
			"body" => $collectionArticles->body,
			"date" => $collectionArticles->created_at,
			"actualArticles" => $actualArticles,
		]);
	}

	public function getActualArticles(Request $request)
	{
		$language = $request->json()->get("language");

		$collectionActualArticles = DB::table("articles")
			->select(["id", "url", "image", "title", "announce", "created_at"])
			->where("language", $language)
			->take(4)
			->orderBy("created_at", "desc")
			->get();

		$actualArticles = [];
		foreach ($collectionActualArticles as $articles) {
			$actualArticles[] = [
				"id" => $articles->id,
				"url" => $articles->url,
				"date" => $articles->created_at,
				"title" => $articles->title,
				"announce" => $articles->announce,
				"image" => Storage::url($articles->image),
			];
		}

		return response()->json([
			"success" => true,
			"actualArticles" => $actualArticles,
		]);
	}

	public function getCountArticles(Request $request)
	{
		$language = $request->json()->get("language");
		$collectionCount = DB::table("articles")
			->selectRaw("COUNT(id) AS countId")
			->where("language", $language)
			->first();
		$countArticles = $collectionCount->countId;

		return response()->json([
			"success" => true,
			"countArticles" => $countArticles,
		]);
	}
}
