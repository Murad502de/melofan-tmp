<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\ReCaptchaRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function sendForResetPassword(Request $request)
	{
		$this->validate($request, [
			"email" => "required|email",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$email = $request->json()->get("email");
		$collectionUser = DB::table("users")
			->select("id", "lastName", "firstName", "language")
			->where("email", $email)
			->first();

		if (empty($collectionUser->id)) {
			return response()->json(["success" => true]);
		} else {
			do {
				$verification_code = Str::random(30); //Generate verification code
				$collectionVerify = DB::table("tokens_for_users")
					->select(["id"])
					->where([["token", $verification_code], ["type", "reset_password"]])
					->first();
			} while (!is_null($collectionVerify));
			DB::table("tokens_for_users")->insert([
				"user_id" => $collectionUser->id,
				"token" => $verification_code,
				"type" => "reset_password",
			]);
			$nickname = $collectionUser->firstName . " " . $collectionUser->lastName;
			App::setLocale($collectionUser->language);
			$subject = __("textMessageResetPassword1");
			Mail::send(
				"message.reset_password",
				["login" => $nickname, "verification_code" => $verification_code, "url_reset" => "recovery"],
				function ($mail) use ($email, $nickname, $subject) {
					$mail->to($email, $nickname)->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat Music");
				},
			);

			return response()->json(["success" => true]);
		}
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function resetPassword(Request $request)
	{
		$this->validate($request, [
			"password" =>
				'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/',
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$password = $request->json()->get("password");
		$verification_reset = $request->json()->get("verification_reset");

		$check = DB::table("tokens_for_users")
			->select(["id", 'user_id'])
			->where([["token", $verification_reset], ["type", "reset_password"]])
			->first();

		if (!is_null($check)) {
			$user = User::find($check->user_id);
			$user->update(["password" => Hash::make($password)]);
			DB::table("tokens_for_users")
				->where("user_id", $user->id)
				->delete();
			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false]);
		}
	}
}
