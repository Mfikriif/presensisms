import React, { useState } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Script from "@/Layouts/Script";
import axios from "axios";
import GetHistori from "@/Pages/User/GetHistori";

export default function Histori({ namabulan = [], tahun_awal = 2022 }) {
    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState("");
    const [showHistori, setShowHistori] = useState("");
    const [loading, setLoading] = useState(false);

    const tahunSekarang = new Date().getFullYear();

    const handleCariData = async () => {
        if (!bulan || !tahun) {
            setShowHistori("Pilih bulan dan tahun terlebih dahulu.");
            return;
        }

        setLoading(true); // Mulai loading
        try {
            const response = await axios.post("/gethistori", { bulan, tahun });
            if (response.data.length === 0) {
                setShowHistori("Tidak ada data untuk bulan dan tahun ini.");
            } else {
                setShowHistori(response.data);
            }
        } catch (error) {
            console.error("Error saat mengambil data:", error);
            setShowHistori("Terjadi kesalahan saat mengambil data.");
        } finally {
            setLoading(false); // Selesai loading
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                    disabled={loading}
                    className={`mt-4 w-full px-4 py-2 ${
                        loading
                            ? "bg-gray-400"
                            : "bg-blue-950 hover:bg-blue-900"
                    } text-white text-sm font-medium rounded-md shadow focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                >
                    {loading ? "Memuat..." : "Cari Data"}
                </button>
            </div>

            {/* Hasil Data */}
            <div className="mt-4 p-4 overflow-y-auto h-80 bg-white shadow rounded-lg">
                {loading ? (
                    <p className="text-gray-500 text-sm italic">
                        Memuat data...
                    </p>
                ) : Array.isArray(showHistori) && showHistori.length > 0 ? (
                    <GetHistori histori={showHistori} />
                ) : (
                    <p className="text-gray-500 text-sm italic">
                        {typeof showHistori === "string"
                            ? showHistori
                            : "Tidak ada data yang ditampilkan."}
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
