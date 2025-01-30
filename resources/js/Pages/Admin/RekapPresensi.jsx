import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";

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

    return (
        <>
            <AuthenticatedLayout
                header={<>Rekap Presensi Pegawai</>}
                children={
                    <>
                        <div className="ml-20">
                            <div className=" w-2/4 bg-white shadow-lg ">
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
