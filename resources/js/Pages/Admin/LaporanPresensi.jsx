import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function LaporanPresensi({
    namabulan = [],
    tahun_awal = 2022,
    namaPegawai,
}) {
    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState("");
    const [pegawai, setPegawai] = useState("");
    const [loadingData, setLoadingData] = useState(false);

    const tahunSekarang = new Date().getFullYear();

    const handleCetak = () => {
        if (!bulan || !tahun || !pegawai) {
            alert("Pilih bulan, tahun, dan nama pegawai terlebih dahulu.");
            return;
        }

        // Buat URL dengan parameter query string
        const url =
            route("laporan.cetakPegawai") +
            `?bulan=${bulan}&tahun=${tahun}&idPegawai=${pegawai}`;

        // Buka halaman baru dengan URL tersebut
        window.open(url, "_blank");
    };

    const calculateTimeDifference = (jamMasuk, jamKeluar) => {
        if (!jamMasuk || !jamKeluar) {
            return "0 jam";
        }

        const masuk = new Date(`1970-01-01T${jamMasuk}Z`);
        const keluar = new Date(`1970-01-01T${jamKeluar}Z`);

        const selisih = (keluar - masuk) / (1000 * 60 * 60); // Konversi ke jam

        return `${selisih.toFixed(2)} jam`;
    };

    const exportFileToExcel = async () => {
        if (!bulan || !tahun || !pegawai) {
            alert("Pilih bulan, tahun, dan nama pegawai terlebih dahulu.");
            return;
        }

        setLoadingData(true);

        try {
            const response = await fetch(
                route("laporan.exportExcel", {
                    bulan,
                    tahun,
                    idPegawai: pegawai,
                })
            );

            if (!response.ok) {
                throw new Error("Gagal mengambil data histori pegawai");
            }

            const responseData = await response.json(); // Data JSON yang berisi dua array

            // Pastikan kedua data tidak kosong
            if (
                !responseData.dataPresensi ||
                responseData.dataPresensi.length === 0
            ) {
                alert("Tidak ada data presensi untuk kriteria yang dipilih.");
                setLoadingData(false);
                return;
            }
            if (
                !responseData.statusPresensi ||
                responseData.statusPresensi.length === 0
            ) {
                alert(
                    "Tidak ada data status presensi untuk kriteria yang dipilih."
                );
                setLoadingData(false);
                return;
            }

            // Format data untuk Excel
            const formattedData = responseData.dataPresensi.map(
                (item, index) => {
                    const status = responseData.statusPresensi.find(
                        (statusItem) =>
                            statusItem.tanggal_presensi ===
                            item.tanggal_presensi
                    );

                    return {
                        No: index + 1,
                        "Nama Pegawai": item.nama || "Tidak Diketahui",
                        "Tanggal Presensi": item.tanggal_presensi || "-",
                        "Jam Presensi": item.jam_in || "Tidak Hadir",
                        "Jam Pulang": item.jam_out || "Belum absen pulang",
                        "Akhir Jam Masuk":
                            status.akhir_jam_masuk || "Belum absen pulang",
                        "Status Presensi": status
                            ? status.akhir_jam_masuk
                                ? item.jam_in > status.akhir_jam_masuk
                                    ? "Terlambat"
                                    : "Tepat Waktu"
                                : "Tidak ada data"
                            : "Tidak ada data",
                        "Jumlah Jam": item.jam_out
                            ? calculateTimeDifference(item.jam_in, item.jam_out)
                            : "0 jam",
                    };
                }
            );

            // Generate file Excel
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Laporan Presensi"
            );

            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            const fileData = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const namaPegawai =
                responseData.dataPresensi.length > 0
                    ? responseData.dataPresensi[0].nama || "Tidak Diketahui"
                    : "Tidak Diketahui";

            const namaFile = `Laporan_Presensi_${namaPegawai}_${bulan}_${tahun}.xlsx`;
            saveAs(fileData, namaFile);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Terjadi kesalahan saat mengambil data.");
        }

        setLoadingData(false);
    };

    return (
        <>
            <AuthenticatedLayout
                header={<>Laporan Presensi</>}
                children={
                    <>
                        <div className="ml-20">
                            <div className=" w-2/4 bg-white shadow-lg rounded-lg">
                                <div className="flex flex-col px-5 py-5">
                                    <select
                                        className="mb-4 h-9 rounded-lg"
                                        name="bulan"
                                        id="bulan"
                                        value={bulan}
                                        onChange={(e) =>
                                            setBulan(e.target.value)
                                        }
                                    >
                                        <option value="">Pilih Bulan</option>
                                        {namabulan.map((nama, i) => (
                                            <option key={i} value={i + 1}>
                                                {nama}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        id="tahun"
                                        value={tahun}
                                        onChange={(e) =>
                                            setTahun(e.target.value)
                                        }
                                        className="mb-4 h-9 rounded-lg"
                                    >
                                        <option value="">Tahun</option>
                                        {Array.from(
                                            {
                                                length:
                                                    tahunSekarang -
                                                    tahun_awal +
                                                    1,
                                            },
                                            (_, i) => tahun_awal + i
                                        ).map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="mb-4 h-9 rounded-lg"
                                        name="nama-pegawai"
                                        id="idPegawai"
                                        value={pegawai}
                                        onChange={(e) =>
                                            setPegawai(e.target.value)
                                        }
                                    >
                                        <option value="">Nama pegawai</option>
                                        {namaPegawai.map((pegawai, i) => (
                                            <option key={i} value={pegawai.id}>
                                                {pegawai.nama_lengkap}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-9/12 mx-auto flex flex-row pb-4">
                                    <button
                                        onClick={handleCetak}
                                        disabled={loadingData}
                                        className="bg-green-600 mr-4 rounded-lg text-white w-full py-2"
                                    >
                                        <div className="flex justify-center">
                                            <FiPrinter className="my-auto mr-3" />
                                            <p>Cetak</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={exportFileToExcel}
                                        className="bg-blue-600 rounded-lg text-white w-full py-2"
                                        disabled={loadingData}
                                    >
                                        <div className="flex justify-center">
                                            <MdOutlineFileDownload className="my-auto mr-3 text-xl" />
                                            <p>
                                                {loadingData
                                                    ? "Exporting..."
                                                    : "Export to Excel"}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
