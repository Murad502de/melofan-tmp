<?php

namespace App\Http\Controllers\AuthRoot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class LogoutController extends Controller
{
	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function logout(Request $request)
	{
		try {
			JWTAuth::invalidate($request->token);

			return response()->json([
				"success" => true,
				"message" => "Вы успешно вышели из системы!",
			]);
		} catch (JWTException $exception) {
			return response()->json([
				"success" => false,
				"message" => "К сожалению вам не удалось выйти из системы!",
			]);
		}
	}
}
