<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengajuan_izin', function (Blueprint $table) {
            $table->id(); // Primary key auto-increment
            $table->unsignedBigInteger('kode_pegawai');
            $table->date('tanggal_izin'); // Tanggal izin
            $table->char('status', 1); // i: izin, s: sakit
            $table->string('keterangan', 255); // Keterangan
            $table->char('status_approved', 1)->default('0'); // 0: Pending, 1: Disetujui, 2: Ditolak
            $table->string('file_path')-> nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensisms');
    }
};