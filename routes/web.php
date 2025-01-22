<?php

use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KonfigurasiShiftKerjaController;
use App\Http\Controllers\PresensiController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Operator
Route::get('/', function () {
    return Inertia::render('User/Login');
});
Route::middleware(['auth', 'operator'])->group(function () {
    Route::get('/dashboardop',[DashboardController::class, 'index'])->name("dashboardop");
    // Presensi
    Route::get('/presensi/create',[PresensiController::class, 'create']);
    Route::post('/presensi/store',[PresensiController::class, 'store']);
    // Edit Profile
    Route::get('/editprofile', [PresensiController::class, 'editprofile']);
    Route::post('/presensi/{id}/updateprofile',[PresensiController::class,'updateprofile']);
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

    // Pegawai
    Route::get('/Admin/Daftar-pegawai',[PegawaiController::class,'index'])->name("pegawai.index");
    Route::post('/Admin/tambah-pegawai', [PegawaiController::class,'store'])->name('pegawai.store');
    Route::get('/Admin/pegawai/{pegawai}/edit', [PegawaiController::class, 'edit'])->name('pegawai.edit');
    Route::put('/Admin/pegawai/{pegawai}/update',[PegawaiController::class,'update'])->name('pegawai.update');
    Route::delete('/Admin/pegawai/{pegawai}',[PegawaiController::class,'destroy'])->name('pegawai.destroy');

    // Presensi
    Route::get('/admin/presensi-monitoring', [PresensiController::class,'presensiMonitoring'])->name('pegawai.presensi');

    // Konfigurasi Jam Kerja

    Route::get('/Admin/konfigurasi-shift_kerja',[KonfigurasiShiftKerjaController::class,'index'])->name('konfigurasi.index');
    Route::post('/Admin/konfigurasi-shift_kerja/set_jam_kerja',[KonfigurasiShiftKerjaController::class, 'store'])->name('konfigurasi.store');
    // Route::get('/Admin/konfigurasi-jam_kerja',[KonfigurasiShiftKerjaController::class,'index'])->name('konfigurasi.index');
    Route::post('/Admin/konfigurasi-jam_kerja/set_jam_kerja',[KonfigurasiShiftKerjaController::class, 'store'])->name('konfigurasi.store');

    Route::get('/Admin/konfigurasi-shift-kerja/{konfigurasi}/edit', [KonfigurasiShiftKerjaController::class, 'edit'])->name('konfigurasi.edit');
    Route::put('/Admin/konfigurasi-shift-kerja/{konfigurasi}/update', [KonfigurasiShiftKerjaController::class, 'update'])->name('konfigurasi.update');
    Route::delete('/Admin/konfigurasi-shift-kerja/{id}', [KonfigurasiShiftKerjaController::class, 'destroy'])->name('konfigurasi.destroy');
    Route::get('/Admin/konfigurasi-shift-kerja/{pegawai}',[PegawaiController::class, 'showSetSchedule'])->name('konfigurasi.show');
    Route::post('/Admin/konfigurasi-shift-kerja',[KonfigurasiShiftKerjaController::class,'setJamkerja'])->name('setShift.store');
    Route::put('/Admin/konfigurasi-shift-kerja/{id}',[KonfigurasiShiftKerjaController::class,'updateJamkerja'])->name('setShift.edit');


});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
