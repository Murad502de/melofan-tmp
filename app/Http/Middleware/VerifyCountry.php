<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyCountry
{
	/**
	 * Handle an incoming request.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param \Closure $next
	 * @return mixed
	 */
	public function handle(Request $request, Closure $next)
	{
		$user = auth()->user();
		if ($user->stepKYC == 0 && $user->statusKYC > 0) {
			return $next($request);
		} else {
			return response()->json(["success" => false], 404);
		}
	}
}
