<?php

use App\Models\pengajuan_izin;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


app()->make(Schedule::class)->call(function () {
     $cutoffDate = Carbon::now()->subDays(1)->format('Y-m-d');

        // Ambil data sebelum update untuk debugging
        $pendingIzin = pengajuan_izin::where('status_approved', '0')
            ->whereDate('tanggal_izin', '<=', $cutoffDate)
            ->get();


        // Jika ada izin yang memenuhi syarat, lakukan update
        if ($pendingIzin->count() > 0) {
            pengajuan_izin::where('status_approved', '0')
                ->whereDate('tanggal_izin', '<=', $cutoffDate)
                ->update(['status_approved' => 2]);

        }
})->everyMinute();
