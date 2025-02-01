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
        $kode_pegawai = $user->id;
        $email = $user->email;
        $tanggal_presensi = date("Y-m-d");
        $jam = date("H:i:s");
    
        // Lokasi Kantor
        $latitudekantor = -6.990931121408543;
        $longitudekantor = 110.46086342321159;
    
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
    
        // Mendapatkan hari ini dalam format bahasa Indonesia
        $hariIni = date('l'); // Mendapatkan hari dalam bahasa Inggris
        $hariIndonesia = [
            "Monday" => "Senin",
            "Tuesday" => "Selasa",
            "Wednesday" => "Rabu",
            "Thursday" => "Kamis",
            "Friday" => "Jumat",
            "Saturday" => "Sabtu",
            "Sunday" => "Minggu",
        ];
        $hariSekarang = $hariIndonesia[$hariIni];

        // Cek apakah pegawai memiliki izin atau sakit yang sudah disetujui untuk hari ini
        $izinDisetujui = DB::table('pengajuan_izin')
            ->where('kode_pegawai', $kode_pegawai)
            ->where('tanggal_izin', $tanggal_presensi)
            ->where('status_approved', 1)
            ->first();

        if ($izinDisetujui) {
            return response()->json([
                'error' => 'Anda tidak perlu presensi!',
                'message' => 'Anda sudah mendapatkan izin ' . ($izinDisetujui->status == 'i' ? 'Izin' : 'Sakit') . '. Tidak perlu melakukan presensi.',
            ], 403);
        }
    
        // Cek hari kerja pegawai di set_jam_kerja
        $cekHariKerja = DB::table('set_jam_kerja')
            ->where('nama', $nama)
            ->where('hari', $hariSekarang)
            ->first();
    
        if (!$cekHariKerja) {
            return response()->json([
                'error' => 'Hari ini bukan hari kerja Anda!',
                'message' => 'Anda tidak dapat melakukan presensi di hari yang tidak dijadwalkan.',
            ], 403);
        }
    
        // Ambil konfigurasi shift kerja berdasarkan kode jam kerja
        $shiftKerja = DB::table('konfigurasi_shift_kerja')
            ->where('kode_jamkerja', $cekHariKerja->kode_jamkerja)
            ->first();
    
        if (!$shiftKerja) {
            return response()->json([
                'error' => 'Konfigurasi shift tidak ditemukan!',
                'message' => 'Silakan hubungi administrator untuk konfigurasi shift kerja.',
            ], 500);
        }
    
        // Validasi jam masuk dan pulang berdasarkan shift kerja
        if ($tipeAbsen === 'masuk' && ($jam < $shiftKerja->awal_jam_masuk || $jam > $shiftKerja->akhir_jam_masuk)) {
            return response()->json([
                'error' => 'Tidak dalam waktu absensi masuk!',
                'message' => 'Anda hanya bisa absen masuk antara ' . $shiftKerja->awal_jam_masuk . ' - ' . $shiftKerja->akhir_jam_masuk,
            ], 403);
        }
    
        if ($tipeAbsen === 'pulang' && $jam < $shiftKerja->jam_pulang) {
            return response()->json([
                'error' => 'Belum waktunya pulang!',
                'message' => 'Anda hanya bisa absen pulang setelah ' . $shiftKerja->jam_pulang,
            ], 403);
        }
    
        // Cek radius lokasi kantor
        if ($radius > 90) {
            return response()->json([
                'error' => 'Anda berada di luar radius kantor!',
                'message' => 'Maaf, Anda tidak dapat melakukan presensi karena berada di luar radius yang diizinkan. (' . $radius . ' meter)',
            ], 403);
        }
    
        // Pisahkan data base64 dan decode gambar
        $image_parts = explode(";base64,", $image);
        if (count($image_parts) < 2) {
            return response()->json(['error' => 'Format gambar tidak valid!'], 400);
        }
    
        $image_base64 = base64_decode($image_parts[1]);
    
        // Menyimpan file gambar
        $folderPath = "uploads/absensi/";
        $emailName = explode('@', $email)[0]; // Mengambil bagian sebelum @
        $formatName = $emailName . "-" . $tanggal_presensi . "-" . $tipeAbsen;
        $fileName = $formatName . ".png";
        $filePath = $folderPath . $fileName;
    
        Storage::disk('public')->put($filePath, $image_base64);
    
        // Cek apakah sudah ada presensi untuk hari ini
        $cek = DB::table('presensi')
            ->where('tanggal_presensi', $tanggal_presensi)
            ->where('email', $email)
            ->first();
    
        if ($cek) {
            // Proses Absen Pulang
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
            // Proses Absen Masuk
            if ($tipeAbsen === 'masuk') {
                $data = [
                    'nama' => $nama,
                    'kode_pegawai' => $kode_pegawai,
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
        $user = Auth::user();
    
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

    // Histori Absensi
    public function histori(){
        $namabulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        return Inertia::render('User/Histori',[
            'namabulan' => $namabulan,
    ]);
    }

    public function getHistori(Request $request)
    {
        try {
            $bulan = $request->bulan;
            $tahun = $request->tahun;
            $user = Auth::user();
            $kode_pegawai = $user->id;
    
            // Ambil data presensi
            $presensi = DB::table('presensi')
                ->whereRaw('MONTH(tanggal_presensi) = ?', [$bulan])
                ->whereRaw('YEAR(tanggal_presensi) = ?', [$tahun])
                ->where('kode_pegawai', $kode_pegawai)
                ->orderBy('tanggal_presensi')
                ->get();
    
            // Ambil data pengajuan izin hanya yang disetujui (status_approved = 1)
            $izin = DB::table('pengajuan_izin')
                ->select(
                    'tanggal_izin AS tanggal_presensi',
                    'status',
                    'keterangan',
                    'status_approved',
                    DB::raw('NULL as jam_in'),
                    DB::raw('NULL as jam_out')
                )
                ->whereRaw('MONTH(tanggal_izin) = ?', [$bulan])
                ->whereRaw('YEAR(tanggal_izin) = ?', [$tahun])
                ->where('kode_pegawai', $kode_pegawai)
                ->where('status_approved', 1) // Filter hanya yang disetujui
                ->orderBy('tanggal_izin')
                ->get();
    
            // Gabungkan hasil presensi dan izin
            $histori = collect($presensi)->merge($izin)->sortBy('tanggal_presensi')->values();
    
            return response()->json($histori);
        } catch (\Exception $e) {
            // Debug error
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function izin() {
        $user = Auth::user();
        $kode_pegawai = $user->id;
    
        $dataizin = DB::table('pengajuan_izin')
            ->where('kode_pegawai', $kode_pegawai)
            ->orderBy('tanggal_izin', 'asc') // Mengurutkan berdasarkan tanggal izin secara ascending
            ->get();
        
        return Inertia::render('User/Izin', [
            'dataizin' => $dataizin
        ])->with([
            'successMessage' => session('successMessage'),
            'errorMessage' => session('errorMessage'),
        ]);
    }

    public function batalkanIzin($id)
    {
        // Ambil data izin berdasarkan ID
        $izin = DB::table('pengajuan_izin')->where('id', $id)->first();
    
        // Cek apakah izin ditemukan
        if (!$izin) {
            return response()->json(['error' => 'Izin tidak ditemukan!'], 404);
        }
    
        // Cek apakah izin masih pending (status_approved = 0)
        if ($izin->status_approved != 0) {
            return response()->json([
                'error' => 'Izin tidak dapat dibatalkan!',
                'message' => 'Izin sudah disetujui atau ditolak.'
            ], 403);
        }
    
        // Hapus izin jika masih pending
        DB::table('pengajuan_izin')->where('id', $id)->delete();
    
        return response()->json([
            'message' => 'Izin berhasil dibatalkan!',
            'success' => true
        ], 200);
    }

    public function buatizin(){
        return Inertia::render('User/BuatIzin',[
    ]);
    }

    public function storeizin(Request $request)
    {
        $user = Auth::user();
        $kode_pegawai = $user->id;
    
        $tanggal_izin = $request->tanggal_izin;
        $status = $request->status;
        $keterangan = $request->keterangan;
    
        // **Validasi input**
        $request->validate([
            'tanggal_izin' => 'required|date',
            'status' => 'required|in:i,s', // i = izin, s = sakit
            'keterangan' => 'required|string|max:255',
        ]);
    
        // **Cek apakah izin sudah ada di tanggal yang sama**
        $izinSudahAda = DB::table('pengajuan_izin')
            ->where('kode_pegawai', $kode_pegawai)
            ->where('tanggal_izin', $tanggal_izin)
            ->first();
    
        if ($izinSudahAda) {
            session()->flash('errorMessage', 'Anda sudah mengajukan izin untuk tanggal ini!');
            return redirect('/presensi/izin');
        }
    
        try {
            // **Simpan data izin baru**
            $data = [
                'kode_pegawai' => $kode_pegawai,
                'tanggal_izin' => $tanggal_izin,
                'status' => $status,
                'keterangan' => $keterangan,
                'created_at' => now()
            ];
    
            $simpan = DB::table('pengajuan_izin')->insert($data);
    
            if ($simpan) {
                session()->flash('successMessage', 'Data Berhasil Disimpan');
                return redirect('/presensi/izin');
            } else {
                session()->flash('errorMessage', 'Terjadi kesalahan saat menyimpan data. Coba lagi.');
                return redirect('/presensi/izin');
            }
        } catch (\Exception $e) {
            session()->flash('errorMessage', 'Terjadi kesalahan sistem: ' . $e->getMessage());
            return redirect('/presensi/izin');
        }
    }

    // Presensi Monitoring
    public function presensiMonitoring()
    {   
        $tanggalTahunHariIni = now()->toDateString();
        $presensi = presensi::whereDate('created_at', $tanggalTahunHariIni)->latest()->get();

        $hariIni = now()->locale('id')->translatedFormat('l'); // Nama hari dalam bahasa Indonesia

        $statusPresensi = DB::table('presensi as p')
            ->join('set_jam_kerja as s', 'p.kode_pegawai', '=', 's.id')
            ->join('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
            ->select(
                'p.nama',
                'p.jam_in',
                'p.tanggal_presensi',
                'k.akhir_jam_masuk'
            )
            ->whereDate('p.tanggal_presensi', $tanggalTahunHariIni)
            ->where('s.hari', '=', $hariIni) // Filter hari sesuai nama hari
            ->get();


        return Inertia::render('Admin/MonitoringPresensi',['presensi' => $presensi,'statusPresensi' => $statusPresensi]);
    }

}
