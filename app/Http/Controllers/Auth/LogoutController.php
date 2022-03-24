<?php

namespace App\Http\Controllers\Auth;

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
		$this->validate($request, [
			"token" => "required",
		]);

		try {
			JWTAuth::invalidate($request->token);

			return response()->json([
				"success" => true,
			]);
		} catch (JWTException $exception) {
			return response()->json(
				[
					"success" => false,
				],
				500,
			);
		}
	}
}
