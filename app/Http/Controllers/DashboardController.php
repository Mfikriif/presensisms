<?php

namespace App\Http\Controllers;

use App\Models\pegawai;
use App\Models\pengajuan_izin;
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
        $user2 = Auth::user();
        $kode_pegawai = $user2->id;
    
        // Ambil data presensi hari ini
        $presensihariini = DB::table('presensi')
            ->where('email', $email)
            ->where('tanggal_presensi', $hariini)
            ->first();
    
        // Ambil histori presensi bulan ini termasuk izin/sakit
        $historibulanini = DB::table('presensi')
            ->where('email', $email)
            ->whereRaw('MONTH(tanggal_presensi) = ?', [$bulanini])
            ->whereRaw('YEAR(tanggal_presensi) = ?', [$tahunini])
            ->select(
                'tanggal_presensi',
                'jam_in',
                'jam_out',
                DB::raw("'h' as status"),
                DB::raw("NULL as keterangan")
            )
            ->unionAll(
                DB::table('pengajuan_izin')
                    ->where('kode_pegawai', $user->id)
                    ->where('status_approved', 1)
                    ->whereRaw('MONTH(tanggal_izin) = ?', [$bulanini])
                    ->whereRaw('YEAR(tanggal_izin) = ?', [$tahunini])
                    ->select(
                        'tanggal_izin as tanggal_presensi',
                        DB::raw("NULL as jam_in"),
                        DB::raw("NULL as jam_out"),
                        'status',
                        'keterangan'
                    )
            )
            ->orderBy('tanggal_presensi', 'desc') // Urutkan berdasarkan tanggal terbaru
            ->get();
    
        // Ambil shift kerja pegawai
        $shift = DB::table('konfigurasi_shift_kerja')
            ->where('kode_jamkerja', function ($query) use ($kode_pegawai) {
                $query->select('kode_jamkerja')
                      ->from('pegawais')
                      ->where('id', $kode_pegawai)
                      ->limit(1);
            })
            ->first();
    
        // Rekap presensi bulanan
        $rekappresensi = DB::table('presensi')
            ->selectRaw('COUNT(email) as hadir, SUM(IF(jam_in > "07:00",1,0)) as terlambat')
            ->where('email',$email)
            ->whereRaw('MONTH(tanggal_presensi)="'.$bulanini.'"')
            ->whereRaw('YEAR(tanggal_presensi)="'.$tahunini.'"')
            ->first();
    
        // Leaderboard berdasarkan presensi hari ini
        $leaderboard = DB::table('presensi')
            ->join('pegawais', 'presensi.email', '=', 'pegawais.email')
            ->where('tanggal_presensi', $hariini)
            ->get();
    
        $namabulan = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    
        // Rekap Izin / Sakit
        $rekapizin = DB::table('pengajuan_izin')
            ->selectRaw('
                SUM(IF(status="i",1,0)) as jmlizin, 
                SUM(IF(status="s",1,0)) as jmlsakit
            ')
            ->where('kode_pegawai', $kode_pegawai)
            ->whereRaw('MONTH(tanggal_izin) = ?', [$bulanini])
            ->whereRaw('YEAR(tanggal_izin) = ?', [$tahunini])
            ->where('status_approved', 1)
            ->first();
    
        return Inertia::render('User/Dashboard', [
            'presensihariini' => $presensihariini,
            'historibulanini' => $historibulanini,
            'namabulan' => $namabulan,
            'bulanini' => $bulanini,
            'tahunini' => $tahunini,
            'rekapPresensi' => $rekappresensi,
            'leaderboard' => $leaderboard,
            'user' => $user,
            'rekapizin' => $rekapizin, 
            'shift' => $shift // Kirim data shift ke frontend
        ]);
    }

    // Dashboard Admin
   public function dashboardAdmin()
{   
    $totalPegawai = pegawai::count();
    $tanggalTahunHariIni = now()->toDateString();
    $hariIni = now()->locale('id')->translatedFormat('l');

    // Filter data izin dan sakit berdasarkan tanggal hari ini
    $totalIzin = pengajuan_izin::where('status', 'i')
        ->whereDate('created_at', $tanggalTahunHariIni)
        ->count();

    $totalSakit = pengajuan_izin::where('status', 's')
        ->whereDate('created_at', $tanggalTahunHariIni)
        ->count();

    // Rekap Presensi
    $rekappresensi = DB::table('presensi as p')
        ->join('set_jam_kerja as s', 'p.kode_pegawai', '=', 's.id')
        ->join('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
        ->selectRaw('
            COUNT(p.id) as total_hadir,
            SUM(IF(p.jam_in > k.akhir_jam_masuk, 1, 0)) as terlambat,
            SUM(IF(p.jam_in <= k.akhir_jam_masuk, 1, 0)) as tepat_waktu
        ')
        ->whereDate('p.tanggal_presensi', $tanggalTahunHariIni)
        ->where('s.hari', '=', $hariIni)
        ->first();

    return Inertia::render('Dashboard', [
        'rekappresensi' => $rekappresensi,
        'totalPegawai' => $totalPegawai,
        'totalIzin' => $totalIzin,
        'totalSakit' => $totalSakit,
    ]);
}

}
