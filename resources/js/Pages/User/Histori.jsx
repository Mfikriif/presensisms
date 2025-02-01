import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
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

        setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <MainLayout title="Histori Absensi">
            <div className="bg-gray-100 min-h-screen pb-20">
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
                    <h1 className="text-lg font-semibold">Histori Presensi</h1>
                </div>

                {/* Form Filter */}
                <div className="p-6 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pilih Bulan */}
                        <div>
                            <label
                                htmlFor="bulan"
                                className="block text-base font-semibold text-gray-800"
                            >
                                Bulan
                            </label>
                            <select
                                id="bulan"
                                className="mt-2 block w-full min-w-[150px] rounded-xl border-gray-300 shadow-md text-base p-3 bg-white focus:border-blue-600 focus:ring focus:ring-blue-300"
                                value={bulan}
                                onChange={(e) => setBulan(e.target.value)}
                            >
                                <option value="">Pilih Bulan</option>
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
                                className="block text-base font-semibold text-gray-800"
                            >
                                Tahun
                            </label>
                            <select
                                id="tahun"
                                className="mt-2 block w-full min-w-[150px] rounded-xl border-gray-300 shadow-md text-base p-3 bg-white focus:border-blue-600 focus:ring focus:ring-blue-300"
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                            >
                                <option value="">Pilih Tahun</option>
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
                        className={`mt-6 w-full px-5 py-3 text-white text-base font-semibold rounded-xl shadow-md ${
                            loading
                                ? "bg-gray-400"
                                : "bg-blue-950 hover:bg-blue-800"
                        } focus:ring focus:ring-blue-300`}
                    >
                        {loading ? "Memuat..." : "Cari Data"}
                    </button>
                </div>

                {/* Hasil Data */}
                <div
                    className="p-4 overflow-y-auto"
                    style={{ height: "calc(100vh - 200px)" }}
                >
                    {loading ? (
                        <p className="text-gray-500 text-sm italic text-center">
                            Memuat data...
                        </p>
                    ) : Array.isArray(showHistori) && showHistori.length > 0 ? (
                        <GetHistori histori={showHistori} />
                    ) : (
                        <p className="text-gray-500 text-sm italic text-center">
                            {typeof showHistori === "string"
                                ? showHistori
                                : "Tidak ada data yang ditampilkan."}
                        </p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
