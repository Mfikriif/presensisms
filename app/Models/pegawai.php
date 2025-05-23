<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class pegawai extends Model
{
    /** @use HasFactory<\Database\Factories\PegawaiFactory> */
    use HasFactory;



    protected $fillable = [
        'nama_lengkap',
        'email',
        'posisi',
        'no_hp',
        'foto',
        'tempat_lahir',
        'tanggal_lahir',
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'email','email');
    }

    public function jamKerja()
    {
        return $this->hasOne(set_jam_kerja::class, 'id', 'id');
    }

    public function pengajuanIzin()
    {
        return $this->hasMany(pengajuan_izin::class,'id','kode_pegawai');
    }

    public function userRole()
    {
        return $this->belongsTo(User::class);
    }

    
}
