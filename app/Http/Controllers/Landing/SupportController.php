<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use App\Rules\ReCaptchaRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{
	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function sendMessageSupport(Request $request)
	{
		$this->validate($request, [
			"name" => "required|string|min:2",
			"email" => "required|email",
			"phone" => "required|string|min:3",
			"support_message" => "required|string|min:3",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$name = $request->json()->get("name");
		$email = $request->json()->get("email");
		$phone = $request->json()->get("phone");
		$support_message = $request->json()->get("support_message");
		$language = $request->json()->get("language");

		App::setLocale($language);
		$subject = __("textMessageSupport1");
		Mail::send(
			"message.support",
			["name" => $name, "email" => $email, "phone" => $phone, "support_message" => $support_message],
			function ($mail) use ($email, $name, $subject) {
				$mail->to(env("MAIL_ADDRESS_SUPPORT"))->subject($subject);
				$mail->from(env("MAIL_USERNAME"), "HitBeat Support");
				$mail->replyTo($email);
			},
		);

		return response()->json(
			[
				"success" => true,
			],
			200,
		);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function sendConnectionSupport(Request $request)
	{
		$this->validate($request, [
			"name" => "required|string|min:2",
			"phone" => "required|string|min:3",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$name = $request->json()->get("name");
		$phone = $request->json()->get("phone");
		$language = $request->json()->get("language");

		App::setLocale($language);
		$subject = __("textMessageConnection1");
		Mail::send("message.connection", ["name" => $name, "phone" => $phone], function ($mail) use ($name, $subject) {
			$mail->to(env("MAIL_ADDRESS_SUPPORT"))->subject($subject);
			$mail->from(env("MAIL_USERNAME"), "HitBeat Support");
		});

		return response()->json(
			[
				"success" => true,
			],
			200,
		);
	}
}
