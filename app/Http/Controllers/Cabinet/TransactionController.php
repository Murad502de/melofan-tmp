<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Payout;
use App\Repositories\TransactionsRepository;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index ( Request $request ) {
        $data = $request->validate( [
            "type"   => "string|required",
            "page"   => "integer|required",
            "period" => "string|required",
        ] );

        $user = auth()->user();

        return response()->json(  ( new TransactionsRepository( $user ) )->getData( $data[ 'type' ], $data[ 'period' ], $data[ 'page' ] ));
    }
}
