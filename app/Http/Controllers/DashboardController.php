<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index(){
        $hariini = date("Y-m-d");
        $email = Auth::user()->email;
        $presensihariini = DB::table('presensi')
            ->where('email', $email)
            ->where('Tanggal_presensi', $hariini)
            ->first();
    
        return Inertia::render('User/Dashboard', [
            'presensihariini' => $presensihariini,
        ]);
    }
}
