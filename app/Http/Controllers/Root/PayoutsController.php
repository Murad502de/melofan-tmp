<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayoutsController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getPayouts(Request $request): \Illuminate\Http\JsonResponse
	{
		$idPayouts = $request->json()->get("id");
		return self::getDataPayouts($idPayouts);
	}

	private static function getDataPayouts($idPayouts): \Illuminate\Http\JsonResponse
	{
		$collectionPayout = DB::table("payouts")
			->select([
				"payouts.id",
				"payouts.created_at",
				"payouts.user_id",
				"payouts.system",
				"payouts.system_id",
				"payouts.amount",
				"payouts.currency",
				"users.email",
				"users.lastName",
				"users.firstName",
			])
			->where("payouts.id", $idPayouts)
			->leftJoin("users", "users.id", "=", "payouts.user_id")
			->first();

		$typePay = "";
		switch ($collectionPayout->system) {
			case 1:
				$typePay = "Payeer";
				break;
			case 2:
				$typePay = "FChange";
				break;
			case 3:
				$typePay = "Advanced Cash";
				break;
			case 4:
				$typePay = "VISA / MasterCard";
				break;
			case 5:
				$typePay = "Bitcoin";
				break;
		}

		$timestamp = strtotime($collectionPayout->created_at);
		$date = date("d.m.Y H:i:s", $timestamp);

		return response()->json([
			"success" => true,
			"idPayouts" => $collectionPayout->id,
			"created_at" => $date,
			"usersId" => $collectionPayout->user_id,
			"usersName" => $collectionPayout->firstName . " " . $collectionPayout->lastName,
			"usersEmail" => $collectionPayout->email,
			"system" => $typePay,
			"systemId" => $collectionPayout->system_id,
			"amount" => $collectionPayout->amount,
			"currency" => $collectionPayout->currency,
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function applyPayouts(Request $request): \Illuminate\Http\JsonResponse
	{
		$idPayouts = $request->json()->get("idPayouts");
		$today = date("Y-m-d H:i:s");

		$collectionPayouts = DB::table("payouts")
			->where("id", $idPayouts)
			->first();
		$isSuccess = false;
		try {
			DB::beginTransaction();
			switch ($collectionPayouts->system) {
				case 1:
					$isSuccess = self::autoPayeer($collectionPayouts->amount, $collectionPayouts->system_id);
					break;
			}

			if ($isSuccess) {
				DB::table("payouts")
					->where([["id", $idPayouts]])
					->update([
						"status" => true,
						"updated_at" => $today,
					]);
				DB::commit();
				return response()->json(["success" => true]);
			} else {
				DB::rollBack();
				return response()->json(["success" => false]);
			}
		} catch (\Throwable $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}

	private static function autoPayeer($amount, $wallet)
	{
		//        // $money -= ($money / 100) * 2;
		//
		//        $accountNumber = '';
		//        $apiId = '';
		//        $apiKey = '';
		//        $payeer = new CPayeer($accountNumber, $apiId, $apiKey);
		//        if ($payeer->isAuth()){
		//            $arTransfer = $payeer->transfer(array(
		//                'curIn' => 'RUB',
		//                'sum' => $amount,
		//                'curOut' => 'RUB',
		//                //'sumOut' => 1,
		//                'to' => $wallet,
		//                //'to' => 'client@mail.com',
		//                'comment' => '',
		//                //'anonim' => 'Y',
		//                //'protect' => 'Y',
		//                //'protectPeriod' => '3',
		//                //'protectCode' => '12345',
		//            ));
		//            if (empty($arTransfer['errors'])){
		return true;
		//            }
		//            else {
		//                return false;
		//            }
		//        } else {
		//            return false;
		//        }
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function closingPayouts(Request $request)
	{
		$idPayouts = $request->json()->get("idPayouts");
		$message = $request->json()->get("messageForUser");

		if ($message) {
			$today = date("Y-m-d H:i:s");
			$collectionPayout = DB::table("payouts")
				->select(["user_id", "amount", "currency"])
				->where("id", $idPayouts)
				->first();

			try {
				DB::beginTransaction();
				DB::table("message_for_user")->insert([
					"user_id" => $collectionPayout->user_id,
					"message" => $message,
					"created_at" => $today,
				]);
				DB::table("finance")
					->where("user_id", $collectionPayout->user_id)
					->increment("balance", $collectionPayout->amount);

				DB::table("payouts")
					->where("id", $idPayouts)
					->delete();
				DB::commit();
			} catch (\Throwable $e) {
				DB::rollBack();
				Log::error($e);
				return response()->json(["success" => false]);
			}

			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false]);
		}
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllOpenPayouts(Request $request)
	{
		$page = (int) $request->json()->get("page") - 1;
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		return response()->json(self::getAllPayouts($page, $perPage, $search, $filter, false));
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllClosePayouts(Request $request)
	{
		$page = (int) $request->json()->get("page") - 1;
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		return response()->json(self::getAllPayouts($page, $perPage, $search, $filter, true));
	}

	/**
	 * @param $page
	 * @param $perPage
	 * @param $search
	 * @param $filter
	 * @param bool $status
	 * @return array
	 */
	private function getAllPayouts($page, $perPage, $search, $filter, bool $status): array
	{
		$arrayNameFields = ["id", "user_id", "amount", "system", "system_id", "created_at", "currency"];
		if ($status) {
			$arrayNameFields[] = "updated_at";
		}

		$whereFilter = [];
		if ($filter) {
			//            if (isset($filter['ban']) && !empty($filter['ban']) && $filter['ban']['isActive']) {
			//                switch ((string)$filter['ban']['select']) {
			//                    case 'ban_true':
			//                        $whereFilter[] = ['users.is_blocked', true];
			//                        break;
			//                    case 'ban_false':
			//                        $whereFilter[] = ['users.is_blocked', false];
			//                        break;
			//                }
			//            }
		}

		if (empty($search)) {
			$whereFilter[] = ["status", $status];
			$collectionPayouts = DB::table("payouts")
				->select($arrayNameFields)
				->where($whereFilter)
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayPayouts = self::collectionPayoutsToArray($collectionPayouts, $status);

			$collectionCount = DB::table("payouts")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countPayouts = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["user_id", "like", "%" . $filter . "%"], ["status", $status]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);

			$collectionPayouts = DB::table("payouts")
				->select($arrayNameFields)
				->where($where[1])
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayPayouts = self::collectionPayoutsToArray($collectionPayouts, $status);

			$collectionCount = DB::table("payouts")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->first();
			$countPayouts = $collectionCount->countId;
		}

		return [
			"success" => true,
			"array" => $resultArrayPayouts,
			"total" => $countPayouts,
		];
	}

	/**
	 * @param $collectionPayouts
	 * @param bool $status
	 * @return array
	 */
	private static function collectionPayoutsToArray($collectionPayouts, $status = false): array
	{
		$resultPayouts = [];
		foreach ($collectionPayouts as $payout) {
			$typePay = "";
			switch ($payout->system) {
				case 1:
					$typePay = "Payeer";
					break;
				case 2:
					$typePay = "FChange";
					break;
				case 3:
					$typePay = "Advanced Cash";
					break;
				case 4:
					$typePay = "VISA / MasterCard";
					break;
				case 5:
					$typePay = "Bitcoin";
					break;
			}

			if ($status) {
				$resultPayouts[] = [
					"id" => $payout->id,
					"user_id" => $payout->user_id,
					"amount" => $payout->amount,
					"currency" => $payout->currency,
					"system" => $typePay,
					"system_id" => $payout->system_id,
					"created_at" => $payout->created_at,
					"updated_at" => $payout->updated_at,
				];
			} else {
				$resultPayouts[] = [
					"id" => $payout->id,
					"user_id" => $payout->user_id,
					"amount" => $payout->amount,
					"currency" => $payout->currency,
					"system" => $typePay,
					"system_id" => $payout->system_id,
					"created_at" => $payout->updated_at,
				];
			}
		}

		return $resultPayouts;
	}
}
