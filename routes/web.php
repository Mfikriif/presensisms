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
    Route::get('/Admin/Daftar-pegawai',[PegawaiController::class,'index'])->name("pegawai.index");
    Route::post('/Admin/tambah-pegawai', [PegawaiController::class,'store'])->name('pegawai.store');
    // Route::get(`/edit-pegawai`, [PegawaiController::class,'edit'])->name('pegawai.edit');
    Route::get('/admin/pegawai/{pegawai}/edit', [PegawaiController::class, 'edit'])->name('pegawai.edit');
    Route::put('/admin/pegawai/{pegawai}/update',[PegawaiController::class,'update'])->name('pegawai.update');
    Route::delete('/admin/pegawai/{pegawai}',[PegawaiController::class,'destroy'])->name('pegawai.destroy');
    // Route::resource('pegawai', PegawaiController::class);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
