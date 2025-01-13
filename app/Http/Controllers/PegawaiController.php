<?php

namespace App\Http\Controllers;

use App\Models\pegawai;
use App\Http\Requests\UpdatepegawaiRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $pegawai = pegawai::latest()->get();
        return inertia('Admin/listPegawai',['pegawai'=> $pegawai]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(Request $request)
    {
        sleep(2); // Simulasi delay (boleh dihapus jika tidak diperlukan)

        // store ke table pegawai
        $inputPegawai = $request->validate([
            'Nama_Lengkap' => 'required|string|max:255',
            'Email' => 'required|email|max:255',
            'Posisi' => 'required|string|max:100',
            'No_Hp' => 'required|string|max:15',
            'Foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'Tempat_Lahir' => 'required|string|max:100',
            'Tanggal_Lahir' => 'required|date',
        ]); 

        if ($request->hasFile('Foto')) {
            // Generate nama unik untuk file 
            $fileName = time() . '_' . $request->file('Foto')->getClientOriginalName();
            
            // Folder tujuan
            $destinationPath = storage_path('app/public/pegawai');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Pindahkan file dari folder temp ke folder tujuan
            $request->file('Foto')->move($destinationPath, $fileName);

            // Simpan path ke database tanpa 'public/'
            $inputPegawai['Foto'] = 'pegawai/' . $fileName;
        }

        // Simpan data pegawai ke database
        pegawai::create($inputPegawai);
        
        // logic store ke table users
        User::create([
            'name' => $inputPegawai['Nama_Lengkap'],
            'email' => $inputPegawai['Email'],
            'password' => bcrypt('12345'),
            'role' => 'operator',
        ]);

        
        
        return redirect()->route('pegawai.index')->with('success', 'Data pegawai berhasil ditambahkan');
    }


    /**
     * Display the specified resource.
     */
    public function show(pegawai $pegawai)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(pegawai $pegawai)
    {
        return Inertia::render('Admin/EditPegawai',['pegawai' => $pegawai]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, pegawai $pegawai)
    {
         sleep(2); // Simulasi delay (boleh dihapus jika tidak diperlukan)

        $inputPegawai = $request->validate([
            'Nama_Lengkap' => 'string|max:255',
            'Email' => 'email|max:255',
            'Posisi' => 'string|max:100',
            'No_Hp' => 'string|max:15',
            'Foto' => 'image|mimes:jpeg,png,jpg|max:2048',
            'Tempat_Lahir' => 'string|max:100',
            'Tanggal_Lahir' => 'date',
        ]); 

        if ($request->hasFile('Foto')) {
            // Generate nama unik untuk file 
            $fileName = time() . '_' . $request->file('Foto')->getClientOriginalName();
            
            // Folder tujuan
            $destinationPath = storage_path('app/public/pegawai');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // Pindahkan file dari folder temp ke folder tujuan
            $request->file('Foto')->move($destinationPath, $fileName);

            // Simpan path ke database tanpa 'public/'
            $inputPegawai['Foto'] = 'pegawai/' . $fileName;
        }

        // Simpan data pegawai ke database
        $pegawai->update($inputPegawai);

        return redirect()->route('pegawai.edit', ['pegawai' => $pegawai->id])->with('success', 'Data pegawai berhasil diperbarui');
    
        // dd($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pegawai $pegawai)
    {
        $pegawai->user()->delete();
        $pegawai->delete();

        return redirect()->route('pegawai.index')->with('success', 'Data pegawai dan akun user pegawai berhasil di hapus');

        dd($pegawai);
    }
}
