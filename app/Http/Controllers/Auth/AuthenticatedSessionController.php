<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('User/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
    
            // Logika pengalihan berdasarkan peran
            if ($user->role === 'admin') {
                return redirect()->route('dashboard');
            } elseif ($user->role === 'operator') {
                return redirect()->route('dashboardop');
            }
    
            // Logout jika role tidak dikenali
            Auth::logout();
            return back()->withErrors([
                'login' => 'Role pengguna tidak dikenali.',
            ]);
        }

        // Menyimpan error di session jika autentikasi gagal
        return back()->withErrors([
            'login' => 'Email atau password tidak cocok dengan data kami.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
    
        // Logout pengguna
        Auth::guard('web')->logout();
    
        // Invalidate session
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    
        // Default redirect untuk operator atau lainnya
        return redirect('/');
    }
}
