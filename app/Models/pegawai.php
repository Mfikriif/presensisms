<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class pegawai extends Model
{
    /** @use HasFactory<\Database\Factories\PegawaiFactory> */
    use HasFactory;

    protected $fillable = [
        'Nama_Lengkap',
        'Email',
        'Posisi',
        'No_Hp',
        'Tempat_Lahir',
        'Tanggal_Lahir',
    ];
    
}
