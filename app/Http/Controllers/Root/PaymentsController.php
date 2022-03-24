<?php

namespace App\Http\Controllers\Root;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentsController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllPayments(Request $request)
	{
		$page = (int) $request->json()->get("page") - 1;
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		return self::getArrayPayments($page, $perPage, $search, $filter);
	}

	private static function getArrayPayments($page, $perPage, $search, $filter)
	{
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

		$resultArrayPayments = [];
		$countPayments = 0;
		if (empty($search)) {
			$collectionPayments = DB::table("payments")
				->select(["id", "user_id", "amount", "currency", "system", "transaction_number", "created_at"])
				->where($whereFilter)
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayPayments = self::collectionPaymentsToArray($collectionPayments);

			$collectionCount = DB::table("payments")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countPayments = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["user_id", "like", "%" . $filter . "%"]],
			];

			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);

			$collectionPayments = DB::table("payments")
				->select(["id", "user_id", "amount", "currency", "system", "transaction_number", "created_at"])
				->where($where[1])
				->orderBy("created_at", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayPayments = self::collectionPaymentsToArray($collectionPayments);

			$collectionCount = DB::table("payments")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->first();
			$countPayments = $collectionCount->countId;
		}

		return response()->json([
			"success" => true,
			"array" => $resultArrayPayments,
			"total" => $countPayments,
		]);
	}

	/**
	 * @param $collectionPayments
	 * @return array
	 */
	private static function collectionPaymentsToArray($collectionPayments)
	{
		$resultPayments = [];
		foreach ($collectionPayments as $payment) {
			$typePay = "";
			switch ($payment->system) {
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

			$resultPayments[] = [
				"id" => $payment->id,
				"userId" => $payment->user_id,
				"amount" => $payment->amount,
				"currency" => $payment->currency,
				"system" => $typePay,
				"transactionNumber" => $payment->transaction_number,
				"created_at" => $payment->created_at,
			];
		}

		return $resultPayments;
	}
}
