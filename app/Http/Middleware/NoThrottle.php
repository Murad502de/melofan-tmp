<?php

namespace App\Http\Middleware;

namespace App\Http\Middleware;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Closure;

class NoThrottle extends ThrottleRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int|string  $maxAttempts
     * @param  float|int  $decayMinutes
     * @param  string  $prefix
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Illuminate\Http\Exceptions\ThrottleRequestsException
     */
    public function handle($request, Closure $next, $maxAttempts = 60, $decayMinutes = 1, $prefix = '')
    {
        if (config("app.app_config", false)) {
            $response = $next($request);
            return $this->addHeaders(
                $response, $maxAttempts,
                $maxAttempts
            );
        }
        return parent::handle($request, $next, $maxAttempts, $decayMinutes);
    }
}
