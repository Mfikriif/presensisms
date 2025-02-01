import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import toast, { Toaster } from "react-hot-toast";

export default function Profile({ pegawai, successMessage, errorMessage }) {
    const [namaLengkap, setNamaLengkap] = useState(pegawai.nama_lengkap || "");
    const [noHp, setNoHp] = useState(pegawai.no_hp || "");

    // Menampilkan notifikasi saat ada pesan
    useEffect(() => {
        if (successMessage) toast.success(successMessage);
        if (errorMessage) toast.error(errorMessage);
    }, [successMessage, errorMessage]);

    return (
        <MainLayout>
            <div className="bg-gray-100 min-h-screen overflow-y-auto">
                {/* Toaster untuk Notifikasi */}
                <Toaster position="top-center" reverseOrder={false} />

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
                        <span className="ml-2 text-sm">Back</span>
                    </button>
                    <h1 className="text-lg font-semibold">Edit Profile</h1>
                </div>

                {/* Form Edit Profile */}
                <form
                    action={`/presensi/${pegawai.id}/updateprofile`}
                    method="POST"
                    encType="multipart/form-data"
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
                            <span>Update</span>
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
