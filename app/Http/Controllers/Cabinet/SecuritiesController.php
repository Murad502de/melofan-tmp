<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SecuritiesController extends Controller
{
	public function getData(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayColumn = [
			"id",
			"round",
			"status",
			"targetAmount",
			"targetPercent",
			"targetMLFN",
			"price",
			"resultAmount",
			"resultPercent",
			"resultMLFN",
			"created_at",
			"updated_at",
		];
		$collectionSecurities = DB::table("securities")
			->select($arrayColumn)
			->where("status", 0)
			->take(2)
			->orderBy("round")
			->orderBy("created_at")
			->orderBy("updated_at")
			->get();

		if (is_null($collectionSecurities)) {
			$collectionSecurities = DB::table("securities")
				->select($arrayColumn)
				->where("status", 1)
				->take(1)
				->orderBy("round", "desc")
				->orderBy("created_at", "desc")
				->orderBy("updated_at", "desc")
				->get();
		}
		$current = [];
		$next = [];
		foreach ($collectionSecurities as $index => $item) {
			if ($index == 0) {
				$current = $item;
			} else {
				$next = [
					"id" => $item->id,
					"round" => $item->round,
					"price" => $item->price,
					"created_at" => $item->created_at,
				];
			}
		}

		return response()->json([
			"success" => true,
			"current" => $current,
			"next" => $next,
		]);
	}

	public function onBuy(Request $request)
	{
		return response()->json(["success" => false]);
	}
}
