<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
	/**
	 * Handle an incoming request.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param Closure $next
	 * @param $roles
	 * //     * @param null $permission
	 * @return mixed
	 */
	public function handle(Request $request, Closure $next, ...$roles)
	{
		//, $permission = null)
		if (
			auth()
				->user()
				->hasRole(...$roles)
		) {
			return $next($request);
		}
		//        if($permission !== null && !auth()->user()->can($permission)) {
		//            return response()->json(['message' => 'Not Found!'], 404);
		//        }
		return response()->json(["success" => false], 404);
	}
}
