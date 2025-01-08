<?php

use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Operator
Route::get('/', function () {
    return Inertia::render('User/Login');
});
Route::middleware(['auth', 'operator'])->group(function () {
    Route::get('/dashboardop', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboardop');
});

// Admin
Route::get('/admin', function () {
    return Inertia::render('Auth/Login');
});

// Rute untuk Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('pegawai',PegawaiController::class);
});

require __DIR__.'/auth.php';
