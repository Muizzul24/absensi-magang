<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Kalau bukan admin, tolak (error 403)
        abort_unless($request->user()?->role === 'admin', 403);

        return $next($request);
    }
}