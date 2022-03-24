<?php

namespace App\Http\Controllers\AuthRoot;

use App\Http\Controllers\Controller;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Google2FA;

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
			return response()->json(false);
		}

		$google2fa_url = Google2FA::getQRCodeUrl("HitBeat", $user->email, $google2fa_secret);
		$renderer = new ImageRenderer(new RendererStyle(256), new SvgImageBackEnd());
		$writer = new Writer($renderer);
		$google2fa_img = base64_encode($writer->writeString($google2fa_url));

		return response()->json([
			"secter_key" => $google2fa_secret,
			"google2fa_img" => $google2fa_img,
		]);
	}

	public function enable2FA(Request $request)
	{
		$user = auth()->user();

		if (!$user->google2fa_enable) {
			$request->validate([
				"verifyCode" => "required",
			]);

			$secret = str_replace(" ", "", $request->json()->get("verifyCode"));
			$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);

			if ($valid) {
				$user->google2fa_enable = 1;
				$user->save();
				return response()->json(true);
			} else {
				return response()->json(
					[
						"errors" => [
							"verifyCode" => [0 => "Неверный одноразовый код"],
						],
					],
					200,
				);
			}
		}
		return response()->json(
			[
				"errors" => [
					"verifyCode" => [0 => "Неверный одноразовый код"],
				],
			],
			200,
		);
	}

	public function disable2FA(Request $request)
	{
		$request->validate([
			"currentPassword" => "required",
			"verifyCode" => "required",
		]);

		$user = auth()->user();
		$secret = str_replace(" ", "", $request->json()->get("verifyCode"));
		$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);

		if (!Hash::check($request->get("currentPassword"), $user->password)) {
			return response()->json(
				[
					"errors" => [
						"currentPassword" => [0 => "Неверный пароль или одноразовый код"],
					],
				],
				200,
			);
		} elseif (!$valid) {
			return response()->json(
				[
					"errors" => [
						"verifyCode" => [0 => "Неверный пароль или одноразовый код"],
					],
				],
				200,
			);
		}
		$user->google2fa_enable = 0;
		$user->save();
		return response()->json(true);
	}

	public function verify2FA(Request $request)
	{
		$request->validate([
			"verifyCode" => "required",
		]);

		$user = auth()->user();
		$secret = str_replace(" ", "", $request->json()->get("verifyCode"));
		$valid = Google2FA::verifyKey($user->google2fa_secret, $secret);

		if ($valid) {
			return response()->json(true);
		} else {
			return response()->json(
				[
					"errors" => [
						"verifyCode" => [0 => "Неверный одноразовый код"],
					],
				],
				200,
			);
		}
	}
}
