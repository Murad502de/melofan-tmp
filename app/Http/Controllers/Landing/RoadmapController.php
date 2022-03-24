<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoadmapController extends Controller
{
	public function getRoadmap(Request $request)
	{
		$language = $request->json()->get("language");
		$collectionRoadmap = DB::table("roadmap")
			->select([
				"id",
				"title",
				"round",
				"target",
				"status",
				"amount",
				"amount",
				"percentCalc",
				"isDisplay",
				"typeTime",
				"month",
				"quarter",
				"year",
				"updated_at",
			])
            ->where([["language", $language], ["isDisplay", true]])
			->orderBy("status")
			->orderBy("year")
			->orderBy("quarter")
			->orderBy("month")
			->orderBy("updated_at")
			->get();

		return response()->json([
			"success" => true,
			"arrayRoadmap" => $collectionRoadmap->toArray(),
		]);
	}
}
