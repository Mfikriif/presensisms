import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import axios from "axios";
import GetHistori from "@/Pages/User/GetHistori";
import toast, { Toaster } from "react-hot-toast";
import { Head } from "@inertiajs/react";

export default function Histori({ namabulan = [], tahun_awal = 2022 }) {
    const tanggalSekarang = new Date();
    const bulanSekarang = tanggalSekarang.getMonth() + 1;
    const tahunSekarang = tanggalSekarang.getFullYear();

    const [bulan, setBulan] = useState(bulanSekarang);
    const [tahun, setTahun] = useState(tahunSekarang);
    const [showHistori, setShowHistori] = useState("");
    const [loading, setLoading] = useState(false);

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
                toast.success("Data berhasil ditampilkan!");
            }
        } catch (error) {
            console.error("Error saat mengambil data:", error);
            setShowHistori("Terjadi kesalahan saat mengambil data.");
            toast.error("Gagal mengambil data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Head title="Histori Absensi | E-Presensi SMS" />
            <div className="flex flex-col min-h-screen bg-gray-100">
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
                        <span className="ml-2 text-sm">Kembali</span>
                    </button>
                    <h1 className="text-lg font-semibold">Histori Presensi</h1>
                </div>

                {/* Konten utama */}
                <div className="flex-grow flex flex-col">
                    {/* Form Filter */}
                    <div className="p-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        {
                                            length:
                                                tahunSekarang - tahun_awal + 1,
                                        },
                                        (_, i) => tahun_awal + i
                                    ).map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleCariData}
                            disabled={loading}
                            className={`mt-6 w-full px-5 py-3 text-white text-base font-semibold rounded-xl shadow-md ${
                                loading ? "bg-gray-400" : "bg-blue-950"
                            } focus:ring focus:ring-blue-300`}
                        >
                            {loading ? "Memuat..." : "Cari Data"}
                        </button>
                    </div>

                    {/* Hasil Data */}
                    <div className="flex-grow overflow-y-auto px-4 pb-28">
                        {loading ? (
                            <p className="text-gray-500 text-sm italic text-center">
                                Memuat data...
                            </p>
                        ) : Array.isArray(showHistori) &&
                          showHistori.length > 0 ? (
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
            </div>
        </MainLayout>
    );
}
