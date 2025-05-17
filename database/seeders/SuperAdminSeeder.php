<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SuperAdminSeeder extends Seeder
{
    public function run()
    {
        // Insert ke tabel users
        DB::table('users')->insert([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'email_verified_at' => now(),
            'role' => 'superadmin',
            'password' => Hash::make('supersecurepassword'),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert ke tabel pegawais
        DB::table('pegawais')->insert([
            'nama_lengkap' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'posisi' => 'Administrator',
            'no_hp' => '081234567890',
            'foto' => '/assets/img/nophoto.png',
            'tempat_lahir' => 'Semarang',
            'tanggal_lahir' => '1990-01-01',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}