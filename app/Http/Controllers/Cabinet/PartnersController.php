<?php

namespace App\Http\Controllers\Cabinet;

use App\Http\Controllers\Controller;
use App\Models\User;

class PartnersController extends Controller
{
    public function getFirstLine () {
        return response()->json(
            User::query()->where( 'mentor', auth()->user()->id )
                ->with( [ 'broker' => function ( $query ) {
                    $query->select( [ 'id', 'mentor', 'email', 'firstName', 'lastName', 'phone', 'created_at' ] );
                } ] )
                ->select( [ 'id', 'mentor', 'email', 'firstName', 'lastName', 'phone', 'created_at' ] )->paginate( 15 )
        );
    }

    public function getSecondLine () {
        $ids = User::query()->where( 'mentor', auth()->user()->id )->pluck( 'id' );

        return response()->json(
            User::query()
				->whereIn( 'mentor', $ids )
                //->where( 'mentor', auth()->user()->id )
                ->with( [ 'broker' => function ( $query ) {
                    $query->select( [ 'id', 'mentor', 'email', 'firstName', 'lastName', 'phone', 'created_at' ] );
                } ] )
                ->select( [ 'id', 'email', 'mentor', 'firstName', 'lastName', 'phone', 'created_at' ] )
                ->paginate( 15 )
        );
    }
}
