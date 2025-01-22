<?php

namespace App\Http\Controllers;

use App\Models\presensi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
            ->where('tanggal_presensi', $hariini)
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
        $tanggal_presensi = date("Y-m-d");
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
        $formatName = $emailName . "-" . $tanggal_presensi . "-" . $tipeAbsen;
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
            ->where('tanggal_presensi', $tanggal_presensi)
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
                    ->where('tanggal_presensi', $tanggal_presensi)
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
                    'tanggal_presensi' => $tanggal_presensi,
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
    public function editprofile(){
        $user = Auth::user();
        $email = $user->email;
        $pegawai = DB::table('pegawais')->where('email', $email)->first();
        return Inertia::render('User/Profile',[
            'pegawai' => $pegawai,
            'successMessage' => session('success'),
            'errorMessage' => session('error'),
    ]);
    }



    public function updateprofile(Request $request)
    {
        $user = Auth::user(); // Mendapatkan data user yang sedang login
    
        // Validasi input
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255', // Nama lengkap wajib
            'no_hp' => 'required|string|max:20',        // Nomor HP wajib
            'password' => 'nullable|string|min:6',      // Password opsional, minimal 6 karakter
        ]);
    
        // Update data di tabel pegawais
        $updatePegawai = DB::table('pegawais')
            ->where('email', $user->email)
            ->update([
                'nama_lengkap' => $request->nama_lengkap,
                'no_hp' => $request->no_hp,
            ]);
    
        // Update data di tabel users
        $user->name = $request->nama_lengkap; // Update nama lengkap di tabel `users`
    
        // Jika password diisi, hash dan simpan
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
    
        $updateUser = $user->save(); // Simpan perubahan di tabel `users`
    
        // Redirect dengan pesan sukses atau error
        if ($updatePegawai || $updateUser) {
            return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
        } else {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui profil.');
        }
    }

    // Presensi Monitoring
    public function presensiMonitoring()
    {   
        $tanggalTahunHariIni = now()->toDateString();

        $presensi = presensi::whereDate('created_at', $tanggalTahunHariIni)->latest()->get();
        return Inertia::render('Admin/MonitoringPresensi',['presensi' => $presensi]);
    }

}
