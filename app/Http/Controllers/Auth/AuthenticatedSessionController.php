<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : []
        ]);
    }

    /**
     * Handle authentication request.
     */
    public function store(Request $request)
    {
        // Validasi input
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        // Coba login
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            
            // dd($user->role);
            if ($user->role === 'superadmin' || $user->role === 'admin') {
                return redirect()->route('dashboard')->with('status', 'Login berhasil');
            } elseif ($user->role === 'operator') {
                return redirect()->route('dashboardop')->with('status', 'Login berhasil');
            }

        }
    
        // Jika gagal login, kembalikan dengan Inertia agar tidak error
        return Inertia::render('User/Login', [
            'errors' => ['login' => 'Email atau password tidak cocok dengan data kami.'],
        ]);
    }

    /**
     * Logout pengguna.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}