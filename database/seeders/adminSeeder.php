<?php

namespace Database\Seeders;

use Illuminate\Container\Attributes\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Hash;

class adminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         FacadesDB::table('users')->insert([
            'kode_pegawai' => 'SMS-001', // Menghasilkan kode unik untuk kode_pegawai
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'role' => 'admin',
            'password' => Hash::make('admin123'), // Gunakan password yang lebih aman
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
