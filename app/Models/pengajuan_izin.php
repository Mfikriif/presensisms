<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class pengajuan_izin extends Model
{
    protected $table = 'pengajuan_izin';

    protected $fillable = [
        'id',
        'kode_pegawai',
        'tanggal_izin',
        'status',
        'keterangan',
        'status_approved',
    ];
}
