<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class Operator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Pastikan pengguna terautentikasi dan memiliki peran 'operator'
        if (Auth::check() && Auth::user()->role === 'operator') {
            return $next($request);
        }

        // Redirect ke dashboard lain jika bukan operator
        return redirect()->route('dashboard')->withErrors('Anda tidak memiliki akses ke halaman ini.');
    }
}
