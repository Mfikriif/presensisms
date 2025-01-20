<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class set_jam_kerja extends Model
{
    protected $table = 'set_jam_kerja';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'nama',
        'hari',
        'kode_jamkerja',
    ];

    
}
