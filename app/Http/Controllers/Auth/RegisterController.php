<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterAuthRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegisterController extends Controller
{
    /**
     * @param RegisterAuthRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register ( RegisterAuthRequest $request ) {
        $email     = $request->json()->get( "email" );
        $password  = $request->json()->get( "password" );
        $firstName = $request->json()->get( "firstName" );
        $lastName  = $request->json()->get( "lastName" );
        $phone     = $request->json()->get( "phone" );
        $mentorId  = $request->json()->get( 'mentorId', 1 );
        $language  = $request->json()->get( "language" );
        $mentor    = User::query()->firstWhere( 'id', $mentorId );

        $user     = User::create( [
            "firstName"   => $firstName,
            "lastName"    => $lastName,
            'mentor'      => $mentor->id ?? 1,
            "email"       => $email,
            "password"    => $password,
            "phone"       => $phone,
            "ip_register" => parent::getIP(),
            "language"    => $language,
        ] );
        $userRole = Role::where( "slug", "user" )->first();
        $user->roles()->attach( $userRole );

        do {
            $verification_code = Str::random( 30 ); //Generate verification code
            $collectionVerify  = DB::table( "tokens_for_users" )
                                   ->select( [ "id" ] )
                                   ->where( [ [ "token", $verification_code ], [ "type", "verify_email" ] ] )
                                   ->first();
        } while ( !is_null( $collectionVerify ) );
        DB::table( "tokens_for_users" )->insert( [
            "user_id" => $user->id,
            "token"   => $verification_code,
            "type"    => "verify_email",
        ] );

        App::setLocale( $user->language );
        $nickname = $user->firstName . " " . $user->lastName;
        $subject  = __( "textMessageVerify1" );
        Mail::send( "message.verify_email", [ "name" => $nickname, "verification_code" => $verification_code ], function (
            $mail
        ) use ( $email, $nickname, $subject ) {
            $mail->to( $email, $nickname )->subject( $subject );
            $mail->from( env( "MAIL_USERNAME" ), "HitBeat Music" );
        } );

        return response()->json( [
            "success" => true,
        ] );
    }

    public function testMail ( Request $request ) {
        $email = "test-z6duzmhrk@srv1.mail-tester.com";

        Mail::send( "message.verify_email", [ "name" => "Test", "verification_code" => "Test" ], function ( $mail ) use (
            $email
        ) {
            $mail->to( $email, "Test" )->subject( "Test" );
            $mail->from( env( "MAIL_USERNAME" ), "HitBeat Music" );
        } );

        return response()->json( [
            "success" => true,
        ] );
    }

    public function getMentor ( Request $request ) {
        $mentor = (int) $request->input( "mentor" );

        $collectionMentor = User::where( [ [ "id", $mentor ], [ "is_verified_email", true ] ] )->first();

        if ( !$collectionMentor ) {
            $collectionMentor = User::query()->where( 'email', 'administrator@hitbeat.com' )->first();
        }

        return response()->json( [
            "success"      => true,
            'idMentor'     => $collectionMentor->id,
            "nameMentor"   => $collectionMentor->firstName . " " . $collectionMentor->lastName,
            "avatarMentor" => $collectionMentor->avatar,
        ] );
    }
}
