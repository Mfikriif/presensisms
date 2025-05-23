<?php

use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KonfigurasiShiftKerjaController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\UserConstroller;
use App\Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
// Operator

Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('login');

Route::middleware(['auth', 'operator'])->group(function () {
    Route::get('/dashboardop',[DashboardController::class, 'index'])->name("dashboardop");
    // Presensi
    Route::get('/presensi/create',[PresensiController::class, 'create']);
    Route::post('/presensi/store',[PresensiController::class, 'store']);
    // Edit Profile
    Route::get('/editprofile', [PresensiController::class, 'editprofile']);
    Route::post('/presensi/{id}/updateprofile',[PresensiController::class,'updateprofile']);
    // Histori
    Route::get('presensi/histori',[PresensiController::class,'histori']);
    Route::post('/gethistori',[PresensiController::class,'getHistori']);
    // Izin
    Route::get('/presensi/izin',[PresensiController::class,'izin']);
    Route::get('/presensi/buatizin',[PresensiController::class,'buatizin']);
    Route::post('/presensi/storeizin',[PresensiController::class,'storeizin']);
    Route::post('/presensi/batalkanizin/{id}',[PresensiController::class,'batalkanIzin']);
    Route::post('/presensi/cekpengajuanizin', [PresensiController::class, 'cekPengajuanIzin']);
    // Shift kerja
    Route::post('/dashboard/set-shift-kerja', [DashboardController::class, 'setShiftKerja'])->name('dashboard.setShiftKerja');
});

// Admin
Route::get('/admin', function () {
    return Inertia::render('Auth/Login');
});

// Rute untuk Admin
Route::middleware(['auth', 'role:admin,superadmin'])->group(function () {
    // Dashboard admin
    Route::get('/dashboard', [DashboardController::class,'dashboardAdmin'])->name('dashboard');

    // Pegawai
    Route::get('/Admin/Daftar-pegawai',[PegawaiController::class,'index'])->name("pegawai.index");
    Route::post('/Admin/tambah-pegawai', [PegawaiController::class,'store'])->name('pegawai.store');
    Route::get('/Admin/pegawai/{pegawai}/edit', [PegawaiController::class, 'edit'])->name('pegawai.edit');
    Route::put('/Admin/pegawai/{pegawai}/update',[PegawaiController::class,'update'])->name('pegawai.update');
    Route::delete('/Admin/pegawai/{pegawai}',[PegawaiController::class,'destroy'])->name('pegawai.destroy');

    // Presensi
    Route::get('/admin/presensi-monitoring', [PresensiController::class,'presensiMonitoring'])->name('pegawai.presensi');

    // Konfigurasi Jam Kerja
    Route::get('/api/shift-pegawai',[KonfigurasiShiftKerjaController::class,'getApiShiftKerja']);
    Route::get('/Admin/konfigurasi-shift_kerja',[KonfigurasiShiftKerjaController::class,'index'])->name('konfigurasi.index');
    Route::post('/Admin/konfigurasi-shift_kerja/set_jam_kerja',[KonfigurasiShiftKerjaController::class, 'store'])->name('konfigurasi.store');
    Route::post('/Admin/konfigurasi-jam_kerja/set_jam_kerja',[KonfigurasiShiftKerjaController::class, 'store'])->name('konfigurasi.store');

    Route::get('/Admin/konfigurasi-shift-kerja/{konfigurasi}/edit', [KonfigurasiShiftKerjaController::class, 'edit'])->name('konfigurasi.edit');
    Route::put('/Admin/konfigurasi-shift-kerja/{konfigurasi}/update', [KonfigurasiShiftKerjaController::class, 'update'])->name('konfigurasi.update');
    Route::delete('/Admin/konfigurasi-shift-kerja/{id}', [KonfigurasiShiftKerjaController::class, 'destroy'])->name('konfigurasi.destroy');

    // Set jam kerja pegawai
    Route::get('/Admin/konfigurasi-shift-kerja/{pegawai}',[PegawaiController::class, 'showSetSchedule'])->name('konfigurasi.show');
    Route::post('/Admin/konfigurasi-shift-kerja',[KonfigurasiShiftKerjaController::class,'setJamkerja'])->name('setShift.store');
    Route::put('/Admin/konfigurasi-shift-kerja/{id}',[KonfigurasiShiftKerjaController::class,'updateJamkerja'])->name('setShift.edit');

    // Laporan presensi
    Route::get('/Admin/Laporan-Presensi',[PresensiController::class, 'laporan'])->name('laporan.index');
    Route::get('/cetaklaporanpegawai', [PresensiController::class, 'cetakLaporanPegawai'])->name('laporan.cetakPegawai');
    Route::get('/laporan/export-excel', [PresensiController::class, 'exportExcel'])->name('laporan.exportExcel');
    Route::get('/Admin/Rekap-Presensi', [PresensiController::class, 'showPageRekap'])->name('laporan.rekap');
    Route::get('/cetak-laporan-presensi', [PresensiController::class, 'getRekapPresensi'])->name('laporan.cetakPresensi');
    Route::get('rekap/export-excel',[PresensiController::class,'getRekapExcel'])->name('rekap.excel');

    // Izin / Sakit
    Route::get('/Admin/izin-/-sakit', [PresensiController::class,'showIzinSakit'])->name('izin.show');
    Route::post('/izin-sakit/${id}/update', [PresensiController::class, 'approvalIzin'])->name('izin.update');
    Route::get('izin-sakit/file/{id}',[PresensiController::class, 'showSuratIzin'])->name('izin.showfile');

    // User update role and password
    Route::get('/user/{id}/edit-role', [UserConstroller::class, 'index'])->name('userrole.edit');
    Route::put('/user/{id}/upda-role',[UserConstroller::class,'updateRole'])->name('roleuser.update');
    Route::post('/admin/user-reset/password/{id}', [UserConstroller::class,'resetPassword'])->name('reset.pass');

});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
