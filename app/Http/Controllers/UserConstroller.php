<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserConstroller extends Controller
{
    public function index($id)
    {
        $user = User::where('id',$id)->get();

        return Inertia::render('Admin/UpdateRole',['user' => $user]);
    }

    public function updateRole(Request $request,$id)
    {
        $request->validate([
            'role' => 'required',
        ]);

        $user = User::findOrfail($id);

        if($user->role === 'superadmin'  && Auth::user()->role !== 'superadmin'){
            return redirect()->back()->with('status', 'Anda tidak dapat mengubah role superadmin');
        }

        $user->update(['role' => $request->input('role')]);

        return back()->with('success', 'Role berhasil ditambahkan');
    }

    public function resetPassword($id)
    {
        $user = User::findOrfail($id);

        // Set password default (misalnya diambil dari config atau hardcoded)
        $defaultPassword = 'operator';
        $user->password = Hash::make($defaultPassword);

        // Simpan password baru
        $user->save();

        return back()->with('success', 'Password berhasil di reset');

    }
}
