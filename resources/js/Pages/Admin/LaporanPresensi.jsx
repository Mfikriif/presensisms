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

    const parseTimeToSeconds = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return hours * 3600 + minutes * 60 + (seconds || 0);
    };

    const hitungJamKeterlambatan = (jamIn, batasJamMasuk) => {
        const selisih =
            parseTimeToSeconds(jamIn) - parseTimeToSeconds(batasJamMasuk);
        return selisih > 0
            ? `terlambat ${Math.floor(selisih / 60)} menit`
            : "Tepat waktu";
    };

    const calculateTimeDifference = (jamMasuk, jamKeluar) => {
        if (!jamMasuk || !jamKeluar) return "-";

        const convertToMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const totalMinutes =
            convertToMinutes(jamKeluar) - convertToMinutes(jamMasuk);

        if (totalMinutes < 0) return "Waktu tidak valid"; // Handle jam_out lebih kecil dari jam_in

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours} jam ${minutes} menit`;
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
            // Cek apakah ada data presensi
            if (
                !responseData.rekapLengkap ||
                responseData.rekapLengkap.length === 0 ||
                !responseData.dataPresensi ||
                responseData.dataPresensi.length === 0
            ) {
                alert(
                    "Tidak ada data status presensi untuk kriteria yang dipilih."
                );
                setLoadingData(false);
                return;
            }

            // Format data untuk Excel
            const formattedData = responseData.rekapLengkap.map(
                (item, index) => {
                    return {
                        No: index + 1,
                        Tanggal: item.tanggal || "-",
                        "Jam Presensi": item.jam_in || "-",
                        "Jam Pulang": item.jam_out || "-",
                        "Status ":
                            !item.jam_in && !item.jam_out
                                ? item.status === "i"
                                    ? "Izin"
                                    : item.status === "s"
                                    ? "Sakit"
                                    : "Tidak Hadir"
                                : item.jam_in && item.jam_out
                                ? item.jam_in > item.jam_masuk
                                    ? hitungJamKeterlambatan(
                                          item.jam_in,
                                          item.jam_masuk
                                      )
                                    : "Tepat Waktu"
                                : "Data Tidak Lengkap",
                        "Jumlah Jam": item.jam_out
                            ? calculateTimeDifference(item.jam_in, item.jam_out)
                            : "-",
                    };
                }
            );

            // Informasi tambahan pegawai
            const namaPegawai =
                responseData.dataPresensi[0]?.nama || "Tidak Diketahui";
            const posisi =
                responseData.dataPresensi[0]?.posisi || "Tidak Diketahui";
            const nomorHp =
                responseData.dataPresensi[0]?.no_hp || "Tidak Diketahui";

            // Buat worksheet kosong
            const worksheet = XLSX.utils.aoa_to_sheet([]);

            // Tambahkan baris info pegawai ke atas worksheet
            XLSX.utils.sheet_add_aoa(
                worksheet,
                [
                    ["Nama Pegawai", namaPegawai],
                    ["Posisi", posisi],
                    ["Nomor HP", nomorHp],
                    [], // Baris kosong pemisah
                ],
                { origin: "A1" }
            );

            // Tambahkan data presensi mulai dari baris ke-5
            XLSX.utils.sheet_add_json(worksheet, formattedData, {
                origin: "A5",
                skipHeader: false, // Tampilkan header kolom
            });

            // Buat dan simpan workbook
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

            const namaFile = `Laporan_Presensi_${namaPegawai}_${bulan}_${tahun}.xlsx`;
            saveAs(fileData, namaFile);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert(`Terjadi kesalahan saat mengambil data. ${error.message}`);
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
