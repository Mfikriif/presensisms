<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('presensi', function (Blueprint $table) {
            $table->string('kode_jam_kerja')->nullable()->after('tanggal_presensi');
        });
    }

    public function down(): void
    {
        Schema::table('presensi', function (Blueprint $table) {
            $table->dropColumn('kode_jam_kerja');
        });
    }
};
