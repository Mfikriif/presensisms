import React, { useState } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Script from "@/Layouts/Script";

export default function Histori({ namabulan, tahun_awal }) {
    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState("");
    const [showHistori, setShowHistori] = useState("");

    const tahunSekarang = new Date().getFullYear();

    const handleCariData = () => {
        // Logika untuk mengambil data histori berdasarkan bulan dan tahun
        setShowHistori(`Menampilkan data untuk bulan ${bulan} tahun ${tahun}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-red-500 text-white flex items-center justify-between px-4 py-3 shadow-md">
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
                <h1 className="text-lg font-semibold">Histori Absensi</h1>
            </div>

            {/* Form Filter */}
            <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                    {/* Pilih Bulan */}
                    <div className="col-span-2">
                        <label
                            htmlFor="bulan"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Pilih Bulan
                        </label>
                        <select
                            id="bulan"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                            value={bulan}
                            onChange={(e) => setBulan(e.target.value)}
                        >
                            <option value="">Bulan</option>
                            {namabulan.map((nama, i) => (
                                <option key={i} value={i + 1}>
                                    {nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pilih Tahun */}
                    <div>
                        <label
                            htmlFor="tahun"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Pilih Tahun
                        </label>
                        <select
                            id="tahun"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                        >
                            <option value="">Tahun</option>
                            {Array.from(
                                { length: tahunSekarang - tahun_awal + 1 },
                                (_, i) => tahun_awal + i
                            ).map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tombol Cari */}
                <button
                    onClick={handleCariData}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow hover:bg-red-600 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                >
                    Cari Data
                </button>
            </div>

            {/* Hasil Data */}
            <div className="mt-4 p-4 overflow-y-auto h-80 bg-white shadow rounded-lg">
                {showHistori ? (
                    <p className="text-gray-700 text-sm">{showHistori}</p>
                ) : (
                    <p className="text-gray-500 text-sm italic">
                        Tidak ada data yang ditampilkan.
                    </p>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
            {/* Scripts */}
            <Script />
        </div>
    );
}
