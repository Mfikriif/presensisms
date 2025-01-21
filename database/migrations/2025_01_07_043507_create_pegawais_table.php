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
        Schema::create('pegawais', function (Blueprint $table) {
            $table->id();
            $table->char("nama_lengkap");
            $table->char("email")->unique();
            $table->char("posisi")->default('operator');
            $table->char("no_Hp")->nullable();
            $table->char("foto")->nullable();
            $table->char("tempat_lahir")->nullable();
            $table->date("tanggal_lahir")->nullable();

            $table->char("Nama_Lengkap");
            $table->char("Email")->unique();
            $table->char("Posisi")->default('Operator');
            $table->char("No_Hp")->nullable();
            $table->char("Foto")->nullable();
            $table->char("Tempat_Lahir")->nullable();
            $table->date("Tanggal_Lahir")->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawais');
    }
};
