import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function RekapPresensi({ namabulan = [], tahun_awal = 2022 }) {
    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState("");
    const [loadingData, setLoadingData] = useState(false);

    const tahunSekarang = new Date().getFullYear();

    const handleCetak = () => {
        if (!bulan || !tahun) {
            alert("Pilih bulan, dan tahun terlebih dahulu.");
            return;
        }

        const url =
            route("laporan.cetakPresensi") + `?bulan=${bulan}&tahun=${tahun}`;
        window.open(url, "_blank");
    };

    const namaBulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "Novermber",
        "Desember",
    ];

    const getNamaBulan = (bulan) => namaBulan[bulan - 1];

    const exportFIletoExcel = async () => {
        if (!bulan || !tahun) {
            alert("Pilih bulan, dan tahun untuk melihat rekap presensi");
            return;
        }

        setLoadingData(true);

        try {
            const response = await fetch(
                route("rekap.excel", {
                    bulan,
                    tahun,
                })
            );

            if (!response.ok) {
                throw new Error("Gagal mengambil data rekap presensi");
            }

            const responData = await response.json();

            if (
                !responData.rekapPresensi ||
                responData.rekapPresensi.length === 0
            ) {
                alert(
                    "Tidak ada rekap presensi untuk bulan dan tahun yang dipilih"
                );
                setLoadingData(false);
                return;
            }

            if (
                !responData.rekapKeterlambatan ||
                Object.keys(responData.rekapKeterlambatan).length === 0
            ) {
                alert(
                    "Tidak ada rekap keterlambatan untuk bulan dan tahun yang dipilih"
                );
                setLoadingData(false);
                return;
            }

            // **Format Data**
            const formattedData = responData.rekapPresensi.reduce(
                (result, current) => {
                    // Cari apakah data untuk karyawan ini sudah ada dalam result
                    let existingEntry = result.find(
                        (entry) =>
                            entry["Nama Karyawan"] === current.nama_lengkap
                    );

                    if (!existingEntry) {
                        // Jika belum ada, buat entry baru untuk karyawan ini
                        existingEntry = {
                            No: result.length + 1,
                            "Nama Karyawan": current.nama_lengkap,
                            ...Array.from({ length: 31 }, (_, i) => [
                                `Tanggal ${i + 1}`,
                                "- / -",
                            ]).reduce((acc, [key, value]) => {
                                acc[key] = value;
                                return acc;
                            }, {}),
                            TH: 0,
                            TT: 0,
                        };
                        result.push(existingEntry);
                    }

                    // Isi presensi pada tanggal yang sesuai
                    const tanggal = new Date(
                        current.tanggal_presensi
                    ).getDate();
                    existingEntry[`Tanggal ${tanggal}`] = `${
                        current.jam_in || "-"
                    } / ${current.jam_out || "-"}`;

                    // Hitung total hadir dan keterlambatan
                    existingEntry.TH += 1;
                    const statusPresensi =
                        responData.rekapKeterlambatan[current.kode_pegawai];
                    if (statusPresensi && statusPresensi.jumlah_keterlambatan) {
                        existingEntry.TT = statusPresensi.jumlah_keterlambatan;
                    }

                    return result;
                },
                []
            );

            // **Generate Worksheet**
            const worksheet = XLSX.utils.json_to_sheet(formattedData);

            // Atur lebar kolom agar lebih rapi
            worksheet["!cols"] = [
                { wch: 5 }, // Kolom "No"
                { wch: 25 }, // Kolom "Nama Karyawan"
                ...Array(31).fill({ wch: 10 }), // Kolom tanggal presensi
                { wch: 8 }, // Kolom "TH"
                { wch: 8 }, // Kolom "TT"
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Presensi");

            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const fileData = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(
                fileData,
                `Rekap_Presensi_${getNamaBulan(bulan)}_${tahun}.xlsx`
            );
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("Terjadi kesalahan saat meng-export data.");
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <>
            <AuthenticatedLayout
                header={<>Rekap Presensi Pegawai</>}
                children={
                    <>
                        <div className="ml-20">
                            <div className="w-2/4 bg-white shadow-lg rounded-lg">
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
                                        className="bg-blue-600 rounded-lg text-white w-full py-2"
                                        disabled={loadingData}
                                        onClick={exportFIletoExcel}
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
