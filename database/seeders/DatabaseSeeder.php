<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // pegawai::factory(20)->create();

        // Jalankan seeder untuk Super Admin
        $this->call(SuperAdminSeeder::class);
    }
}