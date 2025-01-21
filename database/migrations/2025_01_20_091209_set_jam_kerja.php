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
        Schema::create('set_jam_kerja', function (Blueprint $table) {
            $table->unsignedBigInteger('id');
            $table->char('nama');
            $table->char('hari');
            $table->char('kode_jamkerja');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
