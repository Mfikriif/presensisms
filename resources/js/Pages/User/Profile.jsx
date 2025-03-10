import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";

export default function Profile({ pegawai, successMessage, errorMessage }) {
    const [namaLengkap, setNamaLengkap] = useState(pegawai.nama_lengkap || "");
    const [noHp, setNoHp] = useState(pegawai.no_hp || "");
    const [password, setPassword] = useState("");

    // Menampilkan notifikasi saat ada pesan sukses atau error
    useEffect(() => {
        if (successMessage) {
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: successMessage,
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    content: "custom-swal-content",
                },
            });
        }

        if (errorMessage) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: errorMessage,
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    content: "custom-swal-content",
                },
            });
        }
    }, [successMessage, errorMessage]);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Cek apakah data tidak berubah
        if (
            namaLengkap === pegawai.nama_lengkap &&
            noHp === pegawai.no_hp &&
            !password
        ) {
            Swal.fire({
                icon: "info",
                title: "Tidak Ada Perubahan",
                text: "Data tidak ada yang diubah.",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                    popup: "custom-swal-popup",
                    title: "custom-swal-title",
                    content: "custom-swal-content",
                },
            });
            return;
        }

        // Konfirmasi sebelum mengirim data
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Perubahan akan disimpan.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
            customClass: {
                popup: "custom-swal-popup",
                title: "custom-swal-title",
                content: "custom-swal-content",
                confirmButton: "custom-swal-confirm",
                cancelButton: "custom-swal-cancel",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.visit(`/presensi/${pegawai.id}/updateprofile`, {
                    method: "post",
                    data: {
                        nama_lengkap: namaLengkap,
                        no_hp: noHp,
                        password: password,
                    },
                    only: ["pegawai"], // ← Hanya ambil data pegawai
                    replace: true,
                    preserveState: true,
                });
            }
        });
    };

    return (
        <MainLayout>
            <div className="bg-gray-100 min-h-screen overflow-y-auto pb-52">
                {/* Header */}
                <div className="bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">
                    <button
                        onClick={() => (window.location.href = "/dashboardop")}
                        className="flex items-center text-white"
                    >
                        <ion-icon
                            name="chevron-back-outline"
                            className="text-2xl"
                        ></ion-icon>
                        <span className="ml-2 text-sm">Kembali</span>
                    </button>
                    <h1 className="text-lg font-semibold">Ubah Profil</h1>
                </div>

                {/* Form Edit Profile */}
                <form
                    action={`/presensi/${pegawai.id}/updateprofile`}
                    method="POST"
                    onSubmit={handleFormSubmit}
                    className="mt-6 px-4 flex-grow"
                >
                    {/* CSRF Token */}
                    <input
                        type="hidden"
                        name="_token"
                        value={
                            document.querySelector('meta[name="csrf-token"]')
                                .content
                        }
                    />

                    {/* Foto Profil */}
                    <div className="mb-4">
                        <label
                            htmlFor="foto"
                            className="block text-sm font-medium text-gray-700 text-center"
                        >
                            Foto Profil
                        </label>
                        <div className="flex justify-center items-center mt-2">
                            <div className="relative w-28 h-28">
                                <img
                                    src={
                                        pegawai.foto
                                            ? `/storage/${pegawai.foto}`
                                            : "/assets/img/sample/avatar/avatar1.jpg"
                                    }
                                    alt="Foto Profil"
                                    className="w-full h-full rounded-full border-4 border-blue-950 shadow-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Input Nama Lengkap */}
                    <div className="mb-4">
                        <label
                            htmlFor="nama_lengkap"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="nama_lengkap"
                            name="nama_lengkap"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="Nama Lengkap"
                            autoComplete="off"
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                        />
                    </div>

                    {/* Input No HP */}
                    <div className="mb-4">
                        <label
                            htmlFor="no_hp"
                            className="block text-sm font-medium text-gray-700"
                        >
                            No. HP
                        </label>
                        <input
                            type="text"
                            id="no_hp"
                            name="no_hp"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="No. HP"
                            autoComplete="off"
                            value={noHp}
                            onChange={(e) => setNoHp(e.target.value)}
                        />
                    </div>

                    {/* Tempat Lahir */}
                    <div className="mb-4">
                        <label
                            htmlFor="tempat_lahir"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tempat Lahir
                        </label>
                        <input
                            type="text"
                            id="tempat_lahir"
                            name="tempat_lahir"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow bg-gray-200 cursor-not-allowed"
                            value={pegawai.tempat_lahir || ""}
                            disabled
                        />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="mb-4">
                        <label
                            htmlFor="tanggal_lahir"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tanggal Lahir
                        </label>
                        <input
                            type="date"
                            id="tanggal_lahir"
                            name="tanggal_lahir"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow bg-gray-200 cursor-not-allowed"
                            value={pegawai.tanggal_lahir || ""}
                            disabled
                        />
                    </div>

                    {/* Input Password */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            placeholder="Password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-950 rounded-lg shadow hover:bg-blue-900 focus:ring focus:ring-blue-200 focus:ring-opacity-50 flex items-center justify-center gap-2"
                        >
                            <ion-icon
                                name="refresh-outline"
                                className="text-lg"
                            ></ion-icon>
                            <span>Ubah</span>
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
