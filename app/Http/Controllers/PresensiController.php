<?php

namespace App\Http\Controllers;

use App\Models\presensi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiController extends Controller
{
    //
    public function create()
    {
        $hariini = date("Y-m-d");
        $email = Auth::user()->email;
        $cek = DB::table('presensi')
            ->where('Tanggal_presensi', $hariini)
            ->where('email', $email)
            ->count();
    
        return Inertia::render('User/Create', [
            'cek' => $cek,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $nama = $user->name;
        $email = $user->email;
        $Tanggal_presensi = date("Y-m-d");
        $jam = date("H:i:s");
        
        // Lokasi Kantor
        $latitudekantor = -7.023765967616574;
        $longitudekantor = 110.50692516838049;
        
        // Lokasi User
        $lokasi = $request->lokasi;
        $lokasiuser = explode(",", $lokasi);
        $latitudeuser = $lokasiuser[0];
        $longitudeuser = $lokasiuser[1];
        $jarak = $this->distance($latitudekantor, $longitudekantor, $latitudeuser, $longitudeuser);
        $radius = round($jarak["meters"]);
    
        $image = $request->image;
    
        // Validasi input
        $request->validate([
            'tipeAbsen' => 'required|string|in:masuk,pulang',
            'image' => 'required|string',
            'lokasi' => 'required|string',
        ]);
    
        $tipeAbsen = $request->input('tipeAbsen');
    
        // Pisahkan data base64 dan decode gambar
        $image_parts = explode(";base64,", $image);
        if (count($image_parts) < 2) {
            return response()->json(['error' => 'Invalid image format'], 400);
        }
    
        $image_base64 = base64_decode($image_parts[1]);
    
        // Memastikan folder untuk menyimpan absensi
        $folderPath = "uploads/absensi/";
        $emailName = explode('@', $email)[0]; // Mengambil bagian sebelum @
        $formatName = $emailName . "-" . $Tanggal_presensi . "-" . $tipeAbsen;
        $fileName = $formatName . ".png";
        $filePath = $folderPath . $fileName;
    
        // Cek radius
        if ($radius > 25) {
            return response()->json([
                'error' => 'Anda berada di luar radius kantor!',
                'message' => 'Maaf, Anda tidak dapat melakukan presensi karena berada di luar radius yang diizinkan. (' . $radius . ' meter)',
            ], 403);
        }
    
        // Simpan gambar ke storage
        Storage::disk('public')->put($filePath, $image_base64);
    
        // Cek apakah data presensi sudah ada untuk hari ini
        $cek = DB::table('presensi')
            ->where('Tanggal_presensi', $Tanggal_presensi)
            ->where('email', $email)
            ->first();
    
        if ($cek) {
            // Absen Pulang
            if ($tipeAbsen === 'pulang') {
                $data_pulang = [
                    'jam_out' => $jam,
                    'foto_out' => $fileName,
                    'lokasi_out' => $lokasi,
                ];
                $update = DB::table('presensi')
                    ->where('Tanggal_presensi', $Tanggal_presensi)
                    ->where('email', $email)
                    ->update($data_pulang);
    
                if ($update) {
                    return response()->json([
                        'message' => 'Presensi Pulang berhasil disimpan!',
                        'file_path' => Storage::url($filePath),
                    ]);
                } else {
                    return response()->json([
                        'error' => 'Gagal menyimpan presensi pulang ke database.',
                    ], 500);
                }
            }
        } else {
            // Absen Masuk
            if ($tipeAbsen === 'masuk') {
                $data = [
                    'nama' => $nama,
                    'email' => $email,
                    'Tanggal_presensi' => $Tanggal_presensi,
                    'jam_in' => $jam,
                    'foto_in' => $fileName,
                    'lokasi_in' => $lokasi,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $simpan = DB::table('presensi')->insert($data);
    
                if ($simpan) {
                    return response()->json([
                        'message' => 'Presensi Masuk berhasil disimpan!',
                        'file_path' => Storage::url($filePath),
                    ]);
                } else {
                    return response()->json([
                        'error' => 'Gagal menyimpan presensi masuk ke database.',
                    ], 500);
                }
            }
        }
    
        return response()->json(['error' => 'Tipe absen tidak valid.'], 400);
    }

    //Menghitung Jarak
    public function distance($lat1, $lon1, $lat2, $lon2)
    {
        $theta = $lon1 - $lon2;
        $miles = (sin(deg2rad($lat1)) * sin(deg2rad($lat2))) + (cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta)));
        $miles = acos($miles);
        $miles = rad2deg($miles);
        $miles = $miles * 60 * 1.1515;
        $feet = $miles * 5280;
        $yards = $feet / 3;
        $kilometers = $miles * 1.609344;
        $meters = $kilometers * 1000;
        return compact('meters');

    }

    // 
    public function editprofile()
    {
        return Inertia::render('User/Profile');
    }

    // Presensi Monitoring
    public function presensiMonitoring()
    {   
        $tanggalTahunHariIni = now()->toDateString();

        $presensi = presensi::whereDate('created_at', $tanggalTahunHariIni)->latest()->get();
        return Inertia::render('Admin/MonitoringPresensi',['presensi' => $presensi]);
    }

}
