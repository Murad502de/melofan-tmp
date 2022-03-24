<?php

namespace App\Http\Controllers\AuthRoot;

use App\Http\Controllers\Controller;
use App\Rules\ReCaptchaRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class RootController extends Controller
{
	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function checkAuth(Request $request): \Illuminate\Http\JsonResponse
	{
		$admin = auth()->user();
		if (empty($admin)) {
			return response()->json([
				"success" => false,
			]);
		}

		return response()->json([
			"success" => true,
			"roleId" => parent::getNumberRoleForClient($admin->roles()),
			"userId" => $admin->id,
		]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function sendForResetPassword(Request $request): \Illuminate\Http\JsonResponse
	{
		$this->validate($request, [
			"email" => "required|email",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$email = $request->json()->get("email");
		$collectionUser = DB::table("users")
			->select("id", "firstName", "lastName", "language")
			->where([["email", $email]])
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
				["login" => $nickname, "verification_code" => $verification_code, "url_reset" => "root-panel/reset"],
				function ($mail) use ($email, $nickname, $subject) {
					$mail->to($email, $nickname)->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat");
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
			"captcha" => ["required", new ReCaptchaRule()],
		]);

		$password = $request->json()->get("password");
		$verification_reset = $request->json()->get("verification_reset");

		$check = DB::table("tokens_for_users")
			->where([["token", $verification_reset], ["type", "password"]])
			->first();

		if (!is_null($check)) {
			DB::table("users")
				->where("id", $check->user_id)
				->update(["password" => Hash::make($password)]);
			DB::table("tokens_for_users")
				->where("user_id", $check->user_id)
				->delete();

			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false]);
		}
	}

	public function editPassword(Request $request): \Illuminate\Http\JsonResponse
	{
		$user = auth()->user();
		$oldPassword = $request->json()->get("old_password");
		$newPassword = $request->json()->get("password");
		$isTrueOldPassword = Hash::check($oldPassword, $user->password);

		if ($isTrueOldPassword) {
			$this->validate($request, [
				"password" =>
					'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/',
				"captcha" => ["required", new ReCaptchaRule($request->captcha)],
			]);
			DB::table("users")
				->where("id", $user->id)
				->update(["password" => Hash::make($newPassword)]);
			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false]);
		}
	}
}
