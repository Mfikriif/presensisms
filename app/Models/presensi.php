<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class presensi extends Model
{
    protected $table = 'presensi';

    protected $fillable = [
        'kode_pegawai',
        'nama',
        'email',
        'tanggal_presensi',
        'kode_jam_kerja',
        'jam_in',
        'jam_out',
        'foto_in',
        'foto_out',
        'lokasi_in',
        'lokasi_out',
    ];

    public $timestamps = true;

    /**
     * Relasi ke tabel `set_jam_kerja`
     */
    public function set_jam_kerja()
    {
        return $this->hasOne(set_jam_kerja::class, 'nama', 'Nama');
    }

    // Relasi ke tabel `konfigurasi_shift_kerja`
    public function konfigurasi_shift_kerja()
    {
        return $this->belongsTo(konfigurasi_shift_kerja::class, 'kode_jam_kerja', 'kode_jamkerja');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'kode_pegawai', 'id');
    }
}

