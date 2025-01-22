<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index(){
        $hariini = date("Y-m-d");
        $bulanini = date("m") * 1;
        $tahunini = date("Y");
        $email = Auth::user()->email;

        // Ambil data user dari tabel pegawais
        $user = DB::table('pegawais')->where('email', $email)->first();

        $presensihariini = DB::table('presensi')
            ->where('email', $email)
            ->where('tanggal_presensi', $hariini)
            ->first();
        $historibulanini = DB::table('presensi')
            ->where('email',$email)
            ->whereRaw('MONTH(tanggal_presensi)="'.$bulanini.'"')
            ->whereRaw('YEAR(tanggal_presensi)="'.$tahunini.'"')
            ->orderBy('tanggal_presensi')
            ->get();
        $rekappresensi = DB::table('presensi')
            ->selectRaw('COUNT(email) as hadir, SUM(IF(jam_in > "07:00",1,0)) as terlambat')
            ->where('email',$email)
            ->whereRaw('MONTH(tanggal_presensi)="'.$bulanini.'"')
            ->whereRaw('YEAR(tanggal_presensi)="'.$tahunini.'"')
            ->first();

        $leaderboard = DB::table('presensi')
            ->join('pegawais', 'presensi.email', '=', 'pegawais.email')
            ->where('tanggal_presensi', $hariini)
            ->get();
        $namabulan = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

        return Inertia::render('User/Dashboard', [
            'presensihariini' => $presensihariini,
            'historibulanini' => $historibulanini,
            'namabulan' => $namabulan,
            'bulanini' => $bulanini,
            'tahunini' => $tahunini,
            'rekapPresensi' => $rekappresensi,
            'leaderboard' => $leaderboard,
            'user' => $user
        ]);
    }


    // Dashboard Admin
    public function dashboardAdmin()
    {
        $hariIni = now();
    }
}
