<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\api\SxGeoCity\SxGeo;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginAuthRequest;
use App\Models\User;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Google2FA;

class LoginController extends Controller
{
	/**
	 * @param LoginAuthRequest $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function login(LoginAuthRequest $request)
	{
		$creditials = [];
		$creditials["email"] = $request->json()->get("email");
		$creditials["password"] = $request->json()->get("password");
		$creditials["is_verified_email"] = 1;
		$creditials["is_blocked"] = 0;

		$user = User::where("email", $creditials["email"])->first();
		if (!is_null($user)) {
			if ($user->is_blocked) {
				return response()->json([
					"success" => false,
					"idError" => "004",
				]);
			}
			if (!$user->hasRole("user", "broker")) {
				return response()->json([
					"success" => false,
					"idError" => "002",
				]);
			}
		} else {
			return response()->json([
				"success" => false,
				"idError" => "002",
			]);
		}

		if (!$user->is_verified_email) {
			do {
				$verification_code = Str::random(30); //Generate verification code
				$collectionVerify = DB::table("tokens_for_users")
					->select(["id"])
					->where([["token", $verification_code], ["type", "verify_email"]])
					->first();
			} while (!is_null($collectionVerify));
			DB::table("tokens_for_users")->insert([
				"user_id" => $user->id,
				"token" => $verification_code,
				"type" => "verify_email",
			]);

			$nickname = $user->firstName . " " . $user->lastName;
			$email = $creditials["email"];
			App::setLocale($user->language);
			$subject = __("textMessageVerify1");
			Mail::send(
				"message.verify_email",
				["name" => $nickname, "verification_code" => $verification_code],
				function ($mail) use ($email, $nickname, $subject) {
					$mail->to($email, $nickname)->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat Music");
				},
			);

			return response()->json([
				"success" => false,
				"idError" => "001",
			]);
		}

		try {
			$token = JWTAuth::attempt($creditials);

			if (!$token) {
				return response()->json([
					"success" => false,
					"idError" => "002",
				]);
			}
		} catch (JWTException $e) {
			Log::error($e);
			return response()->json(
				[
					"success" => false,
					"idError" => "003",
				],
				500,
			);
		}

		$user = Auth::user();
		$verifyCode = $request->json()->get("verifyCode");
		if ($verifyCode) {
			$secret = str_replace(" ", "", $verifyCode);
			$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);

			if ($valid) {
				$result = [
					"success" => true,
					"token" => $token,
					"user" => UserController::getAllDataUser($user),
				];
			} else {
				$result = [
					"success" => false,
					"idError" => "005",
				];
			}
		} else {
			self::writeIpAuth($user->id, parent::getIP());
			$isEnable2FA = $user->getAttributeValue(env("OTP_ENABLED_COLUMN"));

			if (!$isEnable2FA) {
				$result = [
					"success" => true,
					"token" => $token,
					"user" => UserController::getAllDataUser($user),
				];
			} else {
				$result = [
					"success" => true,
					"enable2fa" => true,
				];
			}
		}

		return response()->json($result);
	}

	private static function writeIpAuth($id, $ip)
	{
		$data_ip = $ip;
		try {
			$sxGeo = new SxGeo("../app/Http/Controllers/api/SxGeoCity/SxGeoCity.dat");
			$data_ip = $sxGeo->getCityFull($ip);
		} catch (\Exception $e) {
			Log::channel("auth_ip")->error($e);
		}
		$date = date("Y-m-d H:i:s");
		DB::table("auth_users")->insert([
			"user_id" => $id,
			"data_ip" => $data_ip ? json_encode($data_ip) : $ip,
			"created_at" => $date,
			"updated_at" => $date,
		]);
	}
}
