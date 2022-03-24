<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;

class FinancesController extends Controller
{
    public function show() {
      $user = auth()->user();

     return response()->json(
         [
             'hbm' =>  $user->finances()->where('currency', 'HBM')->first(),
             'usd' =>  $user->finances()->where('currency', 'USD')->first(),
         ]
     );

    }
}
