<?php

namespace App\Http\Controllers;

use App\Models\pegawai;
use App\Models\presensi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\pengajuan_izin;
use Carbon\Carbon;
use Illuminate\Support\Collection;

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
    
        // -6.993411391499169, 110.42901558392305
        // Lokasi Kantor -7.023826563310556, 110.50695887209068 //artefak -7.059935504906368, 110.42837090396569 //arya : -6.990826334014022, 110.4610780394645 //kampus : -7.048106581965681, 110.44140750027846
        $latitudekantor = -7.023826563310556;
        $longitudekantor = 110.50695887209068;

    
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
                'error' => 'Konfigurasi shift tidak ditemukan.',
                'message' => 'Silakan pilih jam kerja dahulu.',
            ], 500);
        }
    
        // Validasi jam masuk dan pulang berdasarkan shift kerja
        if ($tipeAbsen === 'masuk' && ($jam < $shiftKerja->awal_jam_masuk)) {
            return response()->json([
                'error' => 'Tidak dalam waktu absensi masuk!',
                'message' => 'Anda hanya bisa absen masuk antara ' . $shiftKerja->awal_jam_masuk . ' - ' . $shiftKerja->jam_masuk,
            ], 403);
        }
    
        if ($tipeAbsen === 'pulang' && $jam < $shiftKerja->jam_pulang) {
            return response()->json([
                'error' => 'Belum waktunya pulang!',
                'message' => 'Anda hanya bisa absen pulang setelah ' . $shiftKerja->jam_pulang,
            ], 403);
        }
    
        // Cek radius lokasi kantor
        if ($radius > 20) { // Default : 20
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

        // Copy file dari storage/app/public ke public/storage
        copy(
            storage_path('app/public/' . $filePath),
            public_path('storage/' . $filePath)
        );
    
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

    // Update Profile User
    public function updateprofile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z\s]+$/',
                Rule::unique('pegawais', 'nama_lengkap')->ignore($user->email, 'email'),
            ],
            'no_hp' => [
                'required',
                'string',
                'max:20',
                'regex:/^(\+62|62|0)[0-9]{9,13}$/',
                Rule::unique('pegawais', 'no_hp')->ignore($user->email, 'email'),
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'max:100',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/',
            ],
        ], [
            'nama_lengkap.regex' => 'Nama lengkap hanya boleh berisi huruf dan spasi.',
            'no_hp.regex' => 'Nomor HP harus sesuai format Indonesia dan hanya berisi angka.',
            'password.regex' => 'Password harus mengandung minimal satu huruf besar, satu angka, dan satu simbol',
            'password.min' => 'Password minimal terdiri dari 8 karakter',
            'nama_lengkap.unique' => 'Nama lengkap sudah digunakan.',
            'no_hp.unique' => 'Nomor HP sudah digunakan.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        DB::beginTransaction();

        try {
            $updatePegawai = DB::table('pegawais')
                ->where('email', $user->email)
                ->update([
                    'nama_lengkap' => $validated['nama_lengkap'],
                    'no_hp' => $validated['no_hp'],
                ]);

            $user->name = $validated['nama_lengkap'];
            if ($request->filled('password')) {
                $user->password = Hash::make($validated['password']);
            }

            $updateUser = $user->isDirty() ? $user->save() : false;

            if ($updatePegawai || $updateUser) {
                DB::commit();
                return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
            } else {
                DB::rollBack();
                return redirect()->back()->with('error', 'Tidak ada perubahan yang dilakukan.');
            }
        } catch (\Exception $e) {
            DB::rollBack();
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

    /**
     * Cek apakah pengguna sudah mengajukan izin pada tanggal tertentu
     */
    public function cekPengajuanIzin(Request $request)
    {
        $tanggal = $request->input('tanggal_izin');
        $kodePegawai = Auth::user()->kode_pegawai; // Ambil kode pegawai dari user yang login

        // Cek di tabel pengajuan_izin berdasarkan kode pegawai dan tanggal
        $izinAda = DB::table('pengajuan_izin')
                    ->where('kode_pegawai', $kodePegawai)
                    ->where('tanggal_izin', $tanggal)
                    ->exists();

        // Jika ada izin, kirim 1; jika tidak, kirim 0
        return response()->json($izinAda ? 1 : 0);
    }

    // Pembatalan Izin
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

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Render the page for creating a new leave request.
     *
     * This method returns the Inertia response to render the 'User/BuatIzin' 
     * page, which allows users to fill out the form for submitting a new
     * leave request.
     */

    /******  73db5cff-53b8-446e-9b24-74341686e9e6  *******/     
    public function buatizin(){
        return Inertia::render('User/BuatIzin',[
    ]);
    }

    // Mengirimkan data Izin
    public function storeizin(Request $request)
    {
        $user = Auth::user();
        $kode_pegawai = $user->id;
        $status = $request->input('status'); // Ambil status izin
        
        //  Validasi input
        $request->validate([
            'tanggal_izin' => 'required|date',
            'status' => 'required|in:i,s', // 'i' untuk izin, 's' untuk sakit
            'keterangan' => 'required|string|max:255',
            'file' => ($status === 's') ? 'required|file|mimes:pdf|max:2048' : 'nullable|file|mimes:pdf|max:2048',
        ], [
            'file.required' => 'Bukti surat keterangan sakit wajib diunggah jika memilih sakit.',
            'file.mimes' => 'File harus berupa PDF.',
            'file.max' => 'Ukuran file maksimal 2MB.',
        ]);

        //  Cek apakah izin sudah ada untuk tanggal yang sama
        $izinSudahAda = DB::table('pengajuan_izin')
            ->where('kode_pegawai', $kode_pegawai)
            ->where('tanggal_izin', $request->tanggal_izin)
            ->exists();

        if ($izinSudahAda) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah mengajukan izin untuk tanggal ini!',
            ], 400);
        }

        try {
            $filePath = null;

            //  Upload file hanya jika diunggah
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = 'izin_' . $kode_pegawai . '_' . now()->format('YmdHis') . '.pdf'; // Hanya terima PDF
                $filePath = $file->storeAs('uploads/izin', $filename, 'public');
            }

            //  Simpan data izin ke database
            DB::table('pengajuan_izin')->insert([
                'kode_pegawai' => $kode_pegawai,
                'tanggal_izin' => $request->tanggal_izin,
                'status' => $status,
                'keterangan' => $request->keterangan,
                'file_path' => $filePath, // Path file jika ada
                'created_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Izin berhasil diajukan.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Presensi Monitoring // Controller Admin
    public function presensiMonitoring()
    {   
        $presensi = presensi::latest()->get();

        $statusPresensi = DB::table('presensi as p')
                ->leftJoin('set_jam_kerja as s', function ($join) {
                $join->on('p.kode_pegawai', '=', 's.id')
                    ->whereRaw("LOWER(s.hari) = LOWER(
                        CASE 
                            WHEN DAYNAME(p.tanggal_presensi) = 'Monday' THEN 'Senin'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Tuesday' THEN 'Selasa'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Wednesday' THEN 'Rabu'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Thursday' THEN 'Kamis'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Friday' THEN 'Jumat'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Saturday' THEN 'Sabtu'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Sunday' THEN 'Minggu'
                        END
                    )"); 
            })
            ->leftJoin('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
            ->select(
                'p.nama',
                'p.jam_in',
                'p.jam_out',
                'p.tanggal_presensi',
                's.hari AS shift_hari',
                's.kode_jamkerja',
                'k.nama_jamkerja',
                'k.jam_pulang',
                DB::raw("COALESCE(k.jam_masuk, 'Tidak ada data') AS akhir_jam_masuk")
            )
            ->orderBy('p.tanggal_presensi', 'asc')
            ->get();


        return Inertia::render('Admin/MonitoringPresensi',['presensi' => $presensi,'statusPresensi' => $statusPresensi]);
    }

    private function generateCalender($bulan,$tahun)
    {
        $dates = collect();
        $startDate = Carbon::create($tahun, $bulan, 1);
        $endDate = $startDate->copy()->endOfMonth();

        while ($startDate->lte($endDate)) {
            $dates->push($startDate->format('Y-m-d')); // pakai method, bukan offset
            $startDate->addDay();
        }

        return $dates;
    }

    public function laporan()
    {   
        $namabulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        $namaPegawai = pegawai::orderBy('nama_lengkap')->get();
        return Inertia::render('Admin/LaporanPresensi',['namabulan' => $namabulan, 'namaPegawai' => $namaPegawai]);
    }

    public function cetakLaporanPegawai(Request $request)
    {
        try {
            // Ambil data pegawai
            $dataPegawai = pegawai::where('id', $request->idPegawai)->first();
    
            // Ambil bulan dan tahun dari query string atau fallback ke saat ini
            $bulan = $request->query('bulan', date('m'));
            $tahun = $request->query('tahun', date('Y'));
            $kode_pegawai = $request->query('idPegawai');
    
            // Ambil data presensi pegawai
            $histori = DB::table('presensi')
            ->whereRaw('MONTH(tanggal_presensi) = ?', [$bulan])
            ->whereRaw('YEAR(tanggal_presensi) = ?', [$tahun])
            ->where('kode_pegawai', $kode_pegawai)
            ->get();
    
            // Ambil data izin/sakit pegawai
            $izinSakit = DB::table('pengajuan_izin')
                ->where('kode_pegawai', $kode_pegawai)
                ->whereMonth('tanggal_izin', $bulan)
                ->whereYear('tanggal_izin', $tahun)
                ->select('tanggal_izin', 'status', 'keterangan')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->tanggal_izin => [
                        'status' => $item->status,
                        'keterangan' => $item->keterangan
                    ]];
                });

            $jamKerjaPerHari = DB::table('set_jam_kerja as s')
                ->where('s.id', $kode_pegawai)
                ->leftJoin('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
                ->select('s.hari', 'k.jam_masuk', 'k.jam_pulang')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [strtolower($item->hari) => [
                        'jam_masuk' => $item->jam_masuk,
                        'jam_pulang' => $item->jam_pulang
                    ]];
                });
            
    
            // Generate kalender tanggal untuk bulan tersebut
            $kalender = $this->generateCalender($bulan, $tahun);
    
            // Gabungkan presensi dan izin ke dalam kalender
            $rekapLengkap = $kalender->map(function ($tanggal) use ($histori, $izinSakit, $jamKerjaPerHari) {
                $tanggalString = is_string($tanggal) ? $tanggal : $tanggal->format('Y-m-d');
                $presensi = $histori->firstWhere('tanggal_presensi', $tanggalString);

                $hari = strtolower(Carbon::parse($tanggalString)->locale('id')->isoFormat('dddd')); // dapatkan nama hari
                $jamMasukShift = $jamKerjaPerHari[$hari]['jam_masuk'] ?? null;

                // Hitung apakah terlambat
                $terlambat = null;
                if ($presensi && $presensi->jam_in && $jamMasukShift) {
                    $terlambat = Carbon::parse($presensi->jam_in)->gt(Carbon::parse($jamMasukShift));
                }

                return [
                    'tanggal' => $tanggalString,
                    'jam_in' => $presensi->jam_in ?? null,
                    'jam_out' => $presensi->jam_out ?? null,
                    'foto_in' => $presensi->foto_in ?? null,
                    'foto_out' => $presensi->foto_out ?? null,
                    'status' => $izinSakit[$tanggalString]['status']
                        ?? ($presensi ? 'Hadir' : 'Alpa'),
                    'keterangan' => $izinSakit[$tanggalString]['keterangan'] ?? null,
                    'jam_masuk' => $jamMasukShift,
                    'terlambat' => $terlambat,
                ];
            });
            
    
            // Kirim data ke halaman cetak
            return Inertia::render('Admin/CetakLaporan', [
                'histori' => $rekapLengkap,
                'bulan' => $bulan,
                'tahun' => $tahun,
                // 'statusPresensi' => $statusPresensi,
                'dataPegawai' => $dataPegawai,
                'rekapLengkap' => $rekapLengkap,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Admin/CetakLaporan', [
                'histori' => [],
                'bulan' => null,
                'tahun' => null,
                // 'statusPresensi' => null,
                'dataPegawai' => null,
                'rekapLengkap' => null,
                'error' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);
        }
    }
// export excel laporan presensi
    public function exportExcel(Request $request)
    {
        try {
            // Validasi input tanpa exists
            $request->validate([
                'bulan' => 'required|integer|min:1|max:12',
                'tahun' => 'required|integer|min:2000',
                'idPegawai' => 'required|integer',
            ]);

            $bulan = $request->query('bulan', date('m'));
            $tahun = $request->query('tahun', date('Y'));
            $idPegawai = $request->query('idPegawai');


            // Ambil data presensi
            $dataPresensi = presensi::with('pegawai')
                ->where('kode_pegawai', $idPegawai)
                ->whereYear('tanggal_presensi', $tahun)
                ->whereMonth('tanggal_presensi', $bulan)
                ->orderBy('tanggal_presensi', 'asc')
                ->get();

                // Ambil data izin/sakit pegawai
            $izinSakit = DB::table('pengajuan_izin')
                ->where('kode_pegawai', $idPegawai)
                ->whereMonth('tanggal_izin', $bulan)
                ->whereYear('tanggal_izin', $tahun)
                ->select('tanggal_izin', 'status', 'keterangan')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->tanggal_izin => [
                        'status' => $item->status,
                        'keterangan' => $item->keterangan
                    ]];
                });

            $jamKerjaPerHari = DB::table('set_jam_kerja as s')
                ->where('s.id', $idPegawai)
                ->leftJoin('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
                ->select('s.hari', 'k.jam_masuk', 'k.jam_pulang')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [strtolower($item->hari) => [
                        'jam_masuk' => $item->jam_masuk,
                        'jam_pulang' => $item->jam_pulang
                    ]];
                });
            
    
            // Generate kalender tanggal untuk bulan tersebut
            $kalender = $this->generateCalender($bulan, $tahun);

            $pegawaiInfo = null;

            if ($dataPresensi->isNotEmpty() && $dataPresensi[0]->pegawai) {
                $pegawai = $dataPresensi[0]->pegawai;
                $pegawaiInfo = [
                    'nama' => $pegawai->nama_lengkap,
                    'posisi' => $pegawai->posisi ?? 'Tidak Diketahui',
                    'no_hp' => $pegawai->no_hp ?? 'Tidak Diketahui',
                ];
            }

            if ($dataPresensi->isEmpty()) {
                return response()->json([
                    'message' => 'Tidak ada data presensi',
                    'dataPresensi' => [],
                    'rekapLengkap' => [],
                    'empty' => true,
                ], 200);
            }
    
            // Gabungkan presensi dan izin ke dalam kalender
            $rekapLengkap = $kalender->map(function ($tanggal) use ($dataPresensi, $izinSakit, $jamKerjaPerHari) {
                $tanggalString = is_string($tanggal) ? $tanggal : $tanggal->format('Y-m-d');
                $presensi = $dataPresensi->firstWhere('tanggal_presensi', $tanggalString);

                $hari = strtolower(Carbon::parse($tanggalString)->locale('id')->isoFormat('dddd')); // dapatkan nama hari
                $jamMasukShift = $jamKerjaPerHari[$hari]['jam_masuk'] ?? null;

                // Hitung apakah terlambat
                $terlambat = null;
                if ($presensi && $presensi->jam_in && $jamMasukShift) {
                    $terlambat = Carbon::parse($presensi->jam_in)->gt(Carbon::parse($jamMasukShift));
                }

                return [
                    'tanggal' => $tanggalString,
                    'jam_in' => $presensi->jam_in ?? null,
                    'jam_out' => $presensi->jam_out ?? null,
                    'foto_in' => $presensi->foto_in ?? null,
                    'foto_out' => $presensi->foto_out ?? null,
                    'status' => $izinSakit[$tanggalString]['status']
                        ?? ($presensi ? 'Hadir' : 'Alpa'),
                    'keterangan' => $izinSakit[$tanggalString]['keterangan'] ?? null,
                    'jam_masuk' => $jamMasukShift,
                    'terlambat' => $terlambat,
                ];
            });
            // dd($rekapLengkap);            
    
            return response()->json([
                'dataPresensi' => $pegawaiInfo ? [$pegawaiInfo] : [],
                'rekapLengkap' => $rekapLengkap,
            ]);

        } catch (\Exception $e) {
              // Untuk development: tampilkan line error
                return response()->json([
                    'error' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile()
                ], 500);
        }
    }

    public function showPageRekap()
    {   
        $namabulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        return Inertia::render('Admin/RekapPresensi', ['namabulan' => $namabulan]);
    }

    public function getRekapPresensi(Request $request)
    {
        $bulan = $request->bulan;
        $tahun = $request->tahun;
        
        $subQuery = DB::table('set_jam_kerja')
            ->join('konfigurasi_shift_kerja', 'konfigurasi_shift_kerja.kode_jamkerja', '=', 'set_jam_kerja.kode_jamkerja')
            ->select(
                'set_jam_kerja.id',
                'set_jam_kerja.hari',
                'konfigurasi_shift_kerja.jam_masuk'
            );

        $rekapPresensi = DB::table('presensi')
                ->whereRaw('MONTH(tanggal_presensi) = ?', [$bulan])
                ->whereRaw('YEAR(tanggal_presensi) = ?', [$tahun])
                ->join('pegawais', 'presensi.kode_pegawai', '=', 'pegawais.id')
                ->leftJoinSub($subQuery, 'shift_data', function ($join) {
                    $join->on('pegawais.id', '=', 'shift_data.id')
                        ->whereRaw("LOWER(shift_data.hari) = LOWER(
                            CASE 
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Monday' THEN 'Senin'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Tuesday' THEN 'Selasa'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Wednesday' THEN 'Rabu'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Thursday' THEN 'Kamis'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Friday' THEN 'Jumat'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Saturday' THEN 'Sabtu'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Sunday' THEN 'Minggu'
                            END
                        )");
                })
                ->leftJoin('pengajuan_izin', 'presensi.kode_pegawai', '=', 'pengajuan_izin.kode_pegawai')
                ->select(
                    'presensi.id',
                    'presensi.kode_pegawai',
                    'presensi.tanggal_presensi',
                    'presensi.jam_in',
                    'presensi.jam_out',
                    'pegawais.nama_lengkap',
                    'pegawais.posisi',
                    'pegawais.foto',
                    'pegawais.no_hp',
                    DB::raw('SUM(CASE WHEN pengajuan_izin.status = "i" AND pengajuan_izin.status_approved = 1 THEN 1 ELSE 0 END) AS total_izin'),
                    DB::raw('SUM(CASE WHEN pengajuan_izin.status = "s" AND pengajuan_izin.status_approved = 1 THEN 1 ELSE 0 END) AS total_sakit')
                )
                ->groupBy(
                    'presensi.id',
                    'presensi.kode_pegawai',
                    'presensi.tanggal_presensi',
                    'presensi.jam_in',
                    'presensi.jam_out',
                    'pegawais.nama_lengkap',
                    'pegawais.posisi',
                    'pegawais.foto',
                    'pegawais.no_hp'
                )
                ->orderBy('presensi.tanggal_presensi')
                ->get();





        $statusPresensi = DB::table('presensi as p')
            ->leftJoin('set_jam_kerja as s', function ($join) {
                $join->on('p.kode_pegawai', '=', 's.id')
                    ->whereRaw("LOWER(s.hari) = LOWER(
                        CASE 
                            WHEN DAYNAME(p.tanggal_presensi) = 'Monday' THEN 'Senin'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Tuesday' THEN 'Selasa'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Wednesday' THEN 'Rabu'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Thursday' THEN 'Kamis'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Friday' THEN 'Jumat'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Saturday' THEN 'Sabtu'
                            WHEN DAYNAME(p.tanggal_presensi) = 'Sunday' THEN 'Minggu'
                        END
                    )");
            })
            ->leftJoin('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
            ->select(
                'p.kode_pegawai',
                'p.nama',
                'p.jam_in',
                'p.jam_out',
                'p.tanggal_presensi',
                's.hari AS shift_hari',
                's.kode_jamkerja',
                DB::raw("COALESCE(k.jam_masuk, 'Tidak ada data') AS akhir_jam_masuk"),
                DB::raw("CASE WHEN TIME(p.jam_in) > TIME(k.jam_masuk) THEN 1 ELSE 0 END AS terlambat")
            )
            ->orderBy('p.tanggal_presensi', 'asc')
            ->get();

        // Mengelompokkan data berdasarkan pegawai dan menghitung jumlah keterlambatan
        $rekapKeterlambatan = $statusPresensi->groupBy('kode_pegawai')->map(function ($items) {
            return [
                'nama' => $items->first()->nama,
                'jumlah_keterlambatan' => $items->sum('terlambat'),
                'total_presensi' => $items->count()
            ];
        });



        // dd($rekapPresensi, $rekapKeterlambatan);

        return Inertia::render('Admin/CetakRekap', ['rekapPresensi' => $rekapPresensi,'rekapKeterlambatan' => $rekapKeterlambatan, 'bulan' => $bulan,'tahun' => $tahun]);
    }

    public function getRekapExcel(Request $request)
    {
        try {
            $request->validate([
                'bulan' => 'required|integer',
                'tahun' => 'required|integer'
            ]);

            $bulan = $request->bulan;
            $tahun = $request->tahun;

            $subQuery = DB::table('set_jam_kerja')
            ->join('konfigurasi_shift_kerja', 'konfigurasi_shift_kerja.kode_jamkerja', '=', 'set_jam_kerja.kode_jamkerja')
            ->select(
                'set_jam_kerja.id',
                'set_jam_kerja.hari',
                'konfigurasi_shift_kerja.jam_masuk'
            );

            $rekapPresensi = DB::table('presensi')
                ->whereRaw('MONTH(tanggal_presensi) = ?', [$bulan])
                ->whereRaw('YEAR(tanggal_presensi) = ?', [$tahun])
                ->join('pegawais', 'presensi.kode_pegawai', '=', 'pegawais.id')
                ->leftJoinSub($subQuery, 'shift_data', function ($join) {
                    $join->on('pegawais.id', '=', 'shift_data.id')
                        ->whereRaw("LOWER(shift_data.hari) = LOWER(
                            CASE 
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Monday' THEN 'Senin'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Tuesday' THEN 'Selasa'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Wednesday' THEN 'Rabu'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Thursday' THEN 'Kamis'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Friday' THEN 'Jumat'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Saturday' THEN 'Sabtu'
                                WHEN DAYNAME(presensi.tanggal_presensi) = 'Sunday' THEN 'Minggu'
                            END
                        )");
                })
                ->leftJoin('pengajuan_izin', 'presensi.kode_pegawai', '=', 'pengajuan_izin.kode_pegawai')
                ->select(
                    'presensi.id',
                    'presensi.kode_pegawai',
                    'presensi.tanggal_presensi',
                    'presensi.jam_in',
                    'presensi.jam_out',
                    'pegawais.nama_lengkap',
                    'pegawais.posisi',
                    'pegawais.foto',
                    'pegawais.no_hp',
                    DB::raw('SUM(CASE WHEN pengajuan_izin.status = "i" AND pengajuan_izin.status_approved = 1 THEN 1 ELSE 0 END) AS total_izin'),
                    DB::raw('SUM(CASE WHEN pengajuan_izin.status = "s" AND pengajuan_izin.status_approved = 1 THEN 1 ELSE 0 END) AS total_sakit')
                )
                ->groupBy(
                    'presensi.id',
                    'presensi.kode_pegawai',
                    'presensi.tanggal_presensi',
                    'presensi.jam_in',
                    'presensi.jam_out',
                    'pegawais.nama_lengkap',
                    'pegawais.posisi',
                    'pegawais.foto',
                    'pegawais.no_hp'
                )
                ->orderBy('presensi.tanggal_presensi')
                ->get();





            $statusPresensi = DB::table('presensi as p')
                ->leftJoin('set_jam_kerja as s', function ($join) {
                    $join->on('p.kode_pegawai', '=', 's.id')
                        ->whereRaw("LOWER(s.hari) = LOWER(
                            CASE 
                                WHEN DAYNAME(p.tanggal_presensi) = 'Monday' THEN 'Senin'
                                WHEN DAYNAME(p.tanggal_presensi) = 'Tuesday' THEN 'Selasa'
                                WHEN DAYNAME(p.tanggal_presensi) = 'Wednesday' THEN 'Rabu'
                                WHEN DAYNAME(p.tanggal_presensi) = 'Thursday' THEN 'Kamis'
                                WHEN DAYNAME(p.tanggal_presensi) = 'Friday' THEN 'Jumat'
                                WHEN DAYNAME(p.tanggal_presensi) = 'Saturday' THEN 'Sabtu'
                                WHEN DAYNAME(p.tanggal_presensi) = 'Sunday' THEN 'Minggu'
                            END
                        )");
                })
                ->leftJoin('konfigurasi_shift_kerja as k', 's.kode_jamkerja', '=', 'k.kode_jamkerja')
                ->select(
                    'p.kode_pegawai',
                    'p.nama',
                    'p.jam_in',
                    'p.jam_out',
                    'p.tanggal_presensi',
                    's.hari AS shift_hari',
                    's.kode_jamkerja',
                    DB::raw("COALESCE(k.jam_masuk, 'Tidak ada data') AS akhir_jam_masuk"),
                    DB::raw("CASE WHEN TIME(p.jam_in) > TIME(k.jam_masuk) THEN 1 ELSE 0 END AS terlambat")
                )
                ->orderBy('p.tanggal_presensi', 'asc')
                ->get();

                // dd($rekapPresensi);
            // Mengelompokkan data berdasarkan pegawai dan menghitung jumlah keterlambatan
            $rekapKeterlambatan = $statusPresensi->groupBy('kode_pegawai')->map(function ($items) {
                return [
                    'nama' => $items->first()->nama,
                    'jumlah_keterlambatan' => $items->sum('terlambat'),
                    'total_presensi' => $items->count()
                ];
            });

            
            if ($rekapPresensi->isEmpty()) {
                return response()->json(['error' => 'Tidak ada data presensi']);
            }
            
            if ($rekapKeterlambatan->isEmpty()){
                return response()->json(['error' => ' Tidak ada data keterlambatan presensi']);
            }
            
            return response()->json([
                'rekapPresensi' => $rekapPresensi,
                'rekapKeterlambatan' => $rekapKeterlambatan
            ]);

        } catch (\Throwable $th) {
            return response()->json(['error', $th->getMessage()],500);
        }
    }

    public function showIzinSakit()
    {   
         $dataIzinSakit = pengajuan_izin::with('namaPengaju')->get()->map(function ($dataIzinSakit) {
            return [
                'id' => $dataIzinSakit->id,
                'tanggal_izin' => $dataIzinSakit->tanggal_izin,
                'status' => $dataIzinSakit->status,
                'keterangan' => $dataIzinSakit->keterangan,
                'status_approved' => $dataIzinSakit->status_approved,
                'created_at' => $dataIzinSakit->created_at ,
                'namaPengaju' => $dataIzinSakit->namaPengaju->nama_lengkap ?? 'Tidak di temukan' ,
                'file_path' => $dataIzinSakit->file_path ? Storage::url($dataIzinSakit->file_path) : null,
            ];
        });

        return Inertia::render('Admin/IzinSakit',['dataIzinSakit' => $dataIzinSakit]);
    }

    public function approvalIzin(Request $request, $id)
    {
        $request->validate([
            'status_approved' => 'required',
        ]);

        $izinSakit = pengajuan_izin::find($id);

        if (!$izinSakit) {
            return response()->json(['message' => 'Data tidk ditemukan'], 404);
        }

        $izinSakit->status_approved = $request->status_approved;

        $izinSakit->save();

        return response()->json(['message' => 'Status berhasil diperbarui'], 200);
    }

    public function showSuratIzin ($id)
    {
        $suratIzin = pengajuan_izin::where('id', $id)
                ->whereNotNull('file_path')
                ->firstOrFail();

        $filepath = storage_path('app/public/') . $suratIzin->file_path;

        return response()->download($filepath);
    }
}
