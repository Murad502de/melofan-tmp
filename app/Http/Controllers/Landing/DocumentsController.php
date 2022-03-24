<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentsController extends Controller
{
	public function getListDocuments(Request $request)
	{
		$language = $request->json()->get("language");

		$collectionDocuments = DB::table("documents")
			->select(["id", "name", "url_confirmation", "format", "size", "path"])
			->where([["language", "=", $language], ["isDisplay", true]])
			->orderBy("id", "desc")
			->get();

		$result = [];
		foreach ($collectionDocuments as $document) {
			$arrayTrigger = (array) $document;
			$arrayTrigger["path"] = Storage::url($document->path);
			$result[] = $arrayTrigger;
		}

		return response()->json([
			"success" => true,
			"documents" => $result,
		]);
	}
}
