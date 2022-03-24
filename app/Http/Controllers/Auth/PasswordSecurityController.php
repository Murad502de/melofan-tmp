<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Rules\ReCaptchaRule;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Google2FA;
use Illuminate\Support\Facades\Mail;

class PasswordSecurityController extends Controller
{
	public function init2FA(Request $request)
	{
		$user = auth()->user();
		$google2fa_secret = Google2FA::generateSecretKey();

		try {
			DB::transaction(function () use ($user, $google2fa_secret) {
				DB::table("users")
					->where("id", $user->id)
					->update([
						"google2fa_enable" => 0,
						"google2fa_secret" => $google2fa_secret,
					]);
			});
		} catch (\Throwable $e) {
			Log::error($e);
			return response()->json(["success" => false]);
		}

		$google2fa_url = Google2FA::getQRCodeUrl("HitBeat Music", $user->email, $google2fa_secret);
		$renderer = new ImageRenderer(new RendererStyle(256), new SvgImageBackEnd());
		$writer = new Writer($renderer);
		$google2fa_img = base64_encode($writer->writeString($google2fa_url));

		return response()->json([
			"success" => true,
			"secret_key" => $google2fa_secret,
			"google2fa_img" => $google2fa_img,
		]);
	}

	public function saveReset2FA(Request $request)
	{
		$user = auth()->user();

		if (!$user->google2fa_enable) {
			$request->validate([
				"resetCode" => "required",
				"captcha" => ["required", new ReCaptchaRule($request->captcha)],
			]);
			try {
				DB::transaction(function () use ($user, $request) {
					$user->google2fa_reset = $request->json()->get("resetCode");
					$user->save();
				});
				return response()->json(["success" => true]);
			} catch (\Throwable $e) {
				Log::error($e);
				return response()->json(["success" => false]);
			}
		}
		return response()->json(["success" => false], 401);
	}

	public function sendVerifyCodeEmail(Request $request)
	{
		$user = auth()->user();

		$today = date("Y-m-d H:i:s");
		$collectionVerify = DB::table("tokens_for_users")
			->select(["created_at"])
			->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
			->orderBy("created_at", "desc")
			->first();
		if (!is_null($collectionVerify)) {
			$unixDateRequest = strtotime($collectionVerify->created_at);
			$unixCurrentDate = strtotime($today);

			if ($unixCurrentDate && $unixDateRequest) {
				if ($unixCurrentDate - $unixDateRequest < 60) {
					DB::table("tokens_for_users")
						->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
						->delete();
					return response()->json(["success" => false]);
				}
			} else {
				DB::table("tokens_for_users")
					->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
					->delete();
				return response()->json(["success" => false]);
			}
		}

		try {
			$chars = "0123456789";
			DB::transaction(function () use ($user, $request, $chars, $today) {
				do {
					$verification_code = substr(str_shuffle($chars), 0, 6);
					$collectionVerify = DB::table("tokens_for_users")
						->select(["id"])
						->where([["user_id", $user->id], ["token", $verification_code], ["type", "verify_email_2fa"]])
						->first();
				} while (!is_null($collectionVerify));
				DB::table("tokens_for_users")->insert([
					"user_id" => $user->id,
					"token" => $verification_code,
					"type" => "verify_email_2fa",
					"created_at" => $today,
				]);

				$nickname = $user->firstName . " " . $user->lastName;
				$email = $user->email;
				App::setLocale($user->language);
				$subject = __("textMessage2FA1");
				Mail::send("message.verify2fa_email", ["verification_code" => $verification_code], function (
					$mail
				) use ($email, $nickname, $subject) {
					$mail->to($email, $nickname)->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat Music 2FA");
				});
			});
			return response()->json(["success" => true]);
		} catch (\Throwable $e) {
			Log::error($e);
			return response()->json(["success" => false]);
		}
	}

	public function enable2FA(Request $request)
	{
		$user = auth()->user();

		if (!$user->google2fa_enable) {
			$request->validate([
				"verifyCode2fa" => "required",
				"verifyCodeEmail" => "required",
				"captcha" => ["required", new ReCaptchaRule($request->captcha)],
			]);

			$secret = str_replace(" ", "", $request->json()->get("verifyCode2fa"));
			$secretEmail = str_replace(" ", "", $request->json()->get("verifyCodeEmail"));
			$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);
			if (!$valid) {
				return response()->json(["success" => false]);
			}

			$today = date("Y-m-d H:i:s");
			$collectionVerify = DB::table("tokens_for_users")
				->select(["created_at"])
				->where([["user_id", $user->id], ["token", $secretEmail], ["type", "verify_email_2fa"]])
				->first();
			if (!is_null($collectionVerify)) {
				$unixDateRequest = strtotime($collectionVerify->created_at);
				$unixCurrentDate = strtotime($today);

				if ($unixCurrentDate && $unixDateRequest) {
					if ($unixCurrentDate - $unixDateRequest > 900) {
						DB::table("tokens_for_users")
							->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
							->delete();
						return response()->json(["success" => false]);
					}
				}

				$valid = true;
			} else {
				return response()->json(["success" => false]);
			}

			DB::table("tokens_for_users")
				->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
				->delete();

			if ($valid) {
				$user->google2fa_enable = 1;
				$user->save();
				return response()->json(["success" => true]);
			} else {
				return response()->json(["success" => false]);
			}
		}
		return response()->json(["success" => false], 401);
	}

	public function disable2FA(Request $request)
	{
		$user = auth()->user();
		$request->validate([
			"verifyCode2fa" => "required",
			"verifyCodeEmail" => "required",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$secret = str_replace(" ", "", $request->json()->get("verifyCode2fa"));
		$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);
		if (!$valid) {
			return response()->json(["success" => false]);
		}

		$secretEmail = str_replace(" ", "", $request->json()->get("verifyCodeEmail"));
		$today = date("Y-m-d H:i:s");
		$collectionVerify = DB::table("tokens_for_users")
			->select(["created_at"])
			->where([["user_id", $user->id], ["token", $secretEmail], ["type", "verify_email_2fa"]])
			->first();
		if (!is_null($collectionVerify)) {
			$unixDateRequest = strtotime($collectionVerify->created_at);
			$unixCurrentDate = strtotime($today);

			if ($unixCurrentDate && $unixDateRequest) {
				if ($unixCurrentDate - $unixDateRequest > 900) {
					DB::table("tokens_for_users")
						->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
						->delete();
					return response()->json(["success" => false]);
				}
			}
		} else {
			return response()->json(["success" => false]);
		}
		DB::table("tokens_for_users")
			->where([["user_id", $user->id], ["type", "verify_email_2fa"]])
			->delete();

		$user->google2fa_enable = 0;
		$user->save();
		return response()->json(["success" => true]);
	}

	public function verify2FA(Request $request)
	{
		$request->validate([
			"verifyCode" => "required",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$user = auth()->user();
		$secret = str_replace(" ", "", $request->json()->get("verifyCode"));
		$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);

		if ($valid) {
			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false]);
		}
	}
}
