<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VerifyUserController extends Controller
{
    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyUser ( Request $request ) {
        $verification_code = $request->json()->get( "verification_code" );

        $check = DB::table( "tokens_for_users" )
                   ->where( [ [ "token", $verification_code ], [ "type", "verify_email" ] ] )
                   ->first();

        if ( !is_null( $check ) ) {
            $user = User::find( $check->user_id );

            if ( $user->is_verified_email == 1 ) {
                return response()->json( [
                    "success"   => true,
                    "idMessage" => "001",
                ] );
            }

            $date     = date( "Y-m-d H:i:s" );
            $unixDate = strtotime( $date );
            $user->update( [
                "updated_at"        => $unixDate,
                "is_verified_email" => 1,
                "avatar"            => UserController::generateAvatar( $user->firstName, $user->lastName ),
            ] );

            DB::table( "finance" )->insert( [
                [ "user_id" => $check->user_id, "currency" => "USD" ],
                [ "user_id" => $check->user_id, "currency" => "HBM" ],
            ] );
            DB::table( "tokens_for_users" )
              ->where( "user_id", $user->id )
              ->delete();

            return response()->json( [
                "success"   => true,
                "idMessage" => "002",
            ] );
        }

        return response()->json( [ "success" => false ] );
    }

    public function getCountries ( Request $request ) {
        $search              = $request->json()->get( "value" );
        $collectionCountries = DB::table( "countries" )
                                 ->select( [ "country as name", "iso as value" ] );

        if ( $search ) {
            $collectionCountries = $collectionCountries->where( "country", "like", "%" . $search . "%" );
        }

        return response()->json( [
            "options" => $collectionCountries
                ->orderBy( "name" )
                ->take( 8 )
                ->get(),
        ] );
    }

    public function getRegions ( Request $request ) {
        $countryId         = $request->json()->get( "country" );
        $search            = $request->json()->get( "value" );
        $collectionRegions = DB::table( "regions" )
                               ->select( [ "region as name", "region_code as value" ] )
                               ->where( "iso", 'like', $countryId.'%' );
        if ( $search ) {
            $collectionRegions = $collectionRegions->where( 'region', 'like', "%$search%" );
        };

        return response()->json( [
            "options" => $collectionRegions->take( 8 )->get()->toArray(),
        ] );
    }

    public function getCities ( Request $request ) {
        $isoCountry = $request->json()->get( "country" );
        $search     = $request->json()->get( "value" );

        $collectionCities = DB::table( "cities" )
                              ->select( [ "city as name", "id as value" ] )
                              ->where( "iso", $isoCountry );
        if ( $search ) {
            $collectionCities = $collectionCities->where( 'city', 'like', "%$search%" );
        };

        return response()->json( [
            "options" => $collectionCities->take( 8 )->get()->toArray(),
        ] );
    }

    public function getStepKYC ( Request $request ) {
        $user                = auth()->user();
        $isNeedAccreditation = true;
        if ( $user->country != "US" and $user->country != "CA" ) {
            $isNeedAccreditation = false;
        }

        $messageNotVerify  = "";
        $collectionMessage = DB::table( "message_for_user" )
                               ->select( [ "message" ] )
                               ->where( "user_id", $user->id )
                               ->orderBy( "id" )
                               ->first();
        if ( !is_null( $collectionMessage ) ) {
            $messageNotVerify = $collectionMessage->message;
        }

        return response()->json( [
            "stepKYC"             => $user->stepKYC,
            "isAccreditation"     => $user->isAccreditation,
            "isNeedAccreditation" => $isNeedAccreditation,
            "statusKYC"           => $user->statusKYC,
            "messageNotVerify"    => $messageNotVerify,
        ] );
    }

    public function savePersonalData ( Request $request ) {
        $user      = auth()->user();
        $request->validate([
            'lastName' => 'required|string',
            'firstName' => 'required|string',
            'birthday' => 'required|date',
            'postIndex' => 'required',
            'country' => 'required|string',
            'region' => 'required',
            'city' => 'required|integer',
            'address' => 'required|string',
        ]);

        $lastName  = $request->json()->get( "lastName" );
        $firstName = $request->json()->get( "firstName" );
        $birthday  = $request->json()->get( "birthday" );
        $postIndex = $request->json()->get( "postIndex" );
        $country   = $request->json()->get( "country" );
        $region    = $request->json()->get( "region" );
        $city      = $request->json()->get( "city" );
        $address   = $request->json()->get( "address" );

        if ( $user->stepKYC != 0 ) {
            return response()->json( [
                "success" => false,
            ] );
        }

        $maxBirthday  = strtotime( "-18 years", strtotime( date( "Y-m-d" ) ) );
        $birthdayUser = strtotime( $birthday );
        if ( $maxBirthday < $birthdayUser ) {
            return response()->json( [
                "success" => false,
            ] );
        }

        if (
            empty( $lastName ) ||
            empty( $firstName ) ||
            empty( $birthday ) ||
            empty( $postIndex ) ||
            empty( $country ) ||
            empty( $region ) ||
            empty( $city ) ||
            empty( $address )
        ) {
            return response()->json( [
                "success" => false,
            ] );
        }

        $updateData          = [
            "lastName"  => $lastName,
            "firstName" => $firstName,
            "birthday"  => $birthday,
            "postIndex" => $postIndex,
            "country"   => $country,
            "region"    => $region,
            "city"      => $city,
            "address"   => $address,
            "stepKYC"   => 1,
        ];
        $isNeedAccreditation = true;
        if ( $country != "US" and $country != "CA" ) {
            $updateData[ "statusKYC" ] = 1;
            $isNeedAccreditation       = false;
        }

        DB::table( "users" )
          ->where( "id", $user->id )
          ->update( $updateData );

        return response()->json( [
            "success"             => true,
            "isNeedAccreditation" => $isNeedAccreditation,
        ] );
    }

    public function setDataAccreditation ( Request $request ) {
        $user            = auth()->user();
        $isAccreditation = $request->json()->get( "isAccreditation" );

        $resultStatusKYC = 0;
        $resultStepKYC   = 0;

        if ( $user->country == "US" && !$isAccreditation ) {
            DB::table( "users" )
              ->where( "id", $user->id )
              ->update( [
                  "stepKYC"          => 4,
                  "statusKYC"        => 2,
                  "is_accreditation" => $isAccreditation,
              ] );
            $resultStatusKYC = 2;
            $resultStepKYC   = 4;
        }

        if ( $user->country == "US" && $isAccreditation ) {
            DB::table( "users" )
              ->where( "id", $user->id )
              ->update( [
                  "stepKYC"          => 3,
                  "statusKYC"        => 3,
                  "is_accreditation" => $isAccreditation,
              ] );
            $resultStatusKYC = 3;
            $resultStepKYC   = 3;
        }

        if ( $user->country == "CA" && !$isAccreditation ) {
            DB::table( "users" )
              ->where( "id", $user->id )
              ->update( [
                  "stepKYC"          => 3,
                  "statusKYC"        => 4,
                  "is_accreditation" => $isAccreditation,
              ] );
            $resultStatusKYC = 4;
            $resultStepKYC   = 3;
        }
        if ( $user->country == "CA" && $isAccreditation ) {
            DB::table( "users" )
              ->where( "id", $user->id )
              ->update( [
                  "stepKYC"          => 3,
                  "statusKYC"        => 5,
                  "is_accreditation" => $isAccreditation,
              ] );
            $resultStatusKYC = 5;
            $resultStepKYC   = 3;
        }

        if ( $resultStatusKYC == 0 ) {
            return response()->json( [
                "success" => false,
            ] );
        }
        return response()->json( [
            "success"   => true,
            "statusKYC" => $resultStatusKYC,
            "stepKYC"   => $resultStepKYC,
        ] );
    }

    public function onFinishVerify ( Request $request ) {
        $user = auth()->user();

        DB::table( "users" )
          ->where( "id", $user->id )
          ->update( [
              "stepKYC" => 0,
          ] );

        return response()->json( [
            "success"   => true,
            "statusKYC" => $user->statusKYC,
        ] );
    }
}
