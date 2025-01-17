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
        'Foto',
        'Tempat_Lahir',
        'Tanggal_Lahir',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'Email','email');
    }
    
}
