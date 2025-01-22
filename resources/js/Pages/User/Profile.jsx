import React, { useState } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Script from "@/Layouts/Script";

export default function Profile({ pegawai, successMessage, errorMessage }) {
    const [namaLengkap, setNamaLengkap] = useState(pegawai.Nama_Lengkap || "");
    const [noHp, setNoHp] = useState(pegawai.No_Hp || "");
    const [foto, setFoto] = useState(null);

    const handleFileChange = (e) => {
        setFoto(e.target.files[0]);
    };

    return (
        <div className="bg-gray-100 min-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-blue-500 text-white flex items-center justify-between px-4 py-3 shadow-md">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-white hover:text-gray-200"
                >
                    <ion-icon
                        name="chevron-back-outline"
                        className="text-2xl"
                    ></ion-icon>
                    <span className="ml-2 text-sm">Back</span>
                </button>
                <h1 className="text-lg font-semibold">Edit Profile</h1>
            </div>

            {/* Alerts */}
            <div className="mt-4 px-4">
                {successMessage && (
                    <div
                        className="flex items-center justify-between bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
                        role="alert"
                    >
                        <p className="text-sm">{successMessage}</p>
                        <button
                            className="text-green-500 hover:text-green-700 focus:outline-none"
                            onClick={() => window.location.reload()}
                        >
                            <ion-icon
                                name="close-circle-outline"
                                className="text-lg"
                            ></ion-icon>
                        </button>
                    </div>
                )}
                {errorMessage && (
                    <div
                        className="flex items-center justify-between bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
                        role="alert"
                    >
                        <p className="text-sm">{errorMessage}</p>
                        <button
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            onClick={() => window.location.reload()}
                        >
                            <ion-icon
                                name="close-circle-outline"
                                className="text-lg"
                            ></ion-icon>
                        </button>
                    </div>
                )}
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

                {/* Upload Foto */}
                <div className="mb-4">
                    <label
                        htmlFor="foto"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Upload Foto
                    </label>
                    <div className="mt-2 flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer">
                        <input
                            type="file"
                            id="foto"
                            name="foto"
                            className="hidden"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="foto"
                            className="text-blue-500 flex items-center space-x-2 cursor-pointer"
                        >
                            <ion-icon
                                name="cloud-upload-outline"
                                className="text-2xl"
                            ></ion-icon>
                            <span>{foto ? foto.name : "Tap to Upload"}</span>
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                        <ion-icon
                            name="refresh-outline"
                            className="text-lg"
                        ></ion-icon>
                        <span>Update</span>
                    </button>
                </div>
            </form>

            {/* Bottom Navigation */}
            <BottomNav />
            {/* Scripts */}
            <Script />
        </div>
    );
}
