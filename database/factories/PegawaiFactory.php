<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\pegawai>
 */
class PegawaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Nama_Lengkap' => fake()->name() ,
            'Email' =>fake()->email(),
            'Posisi' =>fake()->text(10),
            'No_Hp' =>fake()->biasedNumberBetween(12,13),
            'Tempat_Lahir' => fake()->text(7),
            'Tanggal_Lahir' => fake()->date(),
        ];
    }
}
