<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class presensi extends Model
{
    protected $table = 'presensi';

    protected $fillable = [
        'Nama',
        'email',
        'Tanggal_presensi',
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
}

