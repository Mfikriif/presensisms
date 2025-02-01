export default function CetakRekap({
    rekapPresensi,
    rekapKeterlambatan,
    bulan,
    tahun,
}) {
    const rowsPerPage = 10;

    // Kelompokkan data presensi berdasarkan kode_pegawai
    const groupedData = rekapPresensi.reduce((acc, item) => {
        const {
            kode_pegawai,
            nama_lengkap,
            tanggal_presensi,
            jam_in,
            jam_out,
        } = item;

        if (!acc[kode_pegawai]) {
            acc[kode_pegawai] = {
                kode_pegawai,
                nama_lengkap,
                presensi: Array(31).fill({ jam_in: "-", jam_out: "-" }),
            };
        }

        const date = new Date(tanggal_presensi).getDate() - 1;
        acc[kode_pegawai].presensi[date] = {
            jam_in: jam_in || "-",
            jam_out: jam_out || "-",
        };

        return acc;
    }, {});

    const combinedData = Object.values(groupedData).map((data) => {
        const keterlambatan = rekapKeterlambatan[data.kode_pegawai];

        return {
            ...data,
            total_presensi: keterlambatan ? keterlambatan.total_presensi : 0,
            jumlah_keterlambatan: keterlambatan
                ? keterlambatan.jumlah_keterlambatan
                : 0,
        };
    });

    const pages = [];
    for (let i = 0; i < combinedData.length; i += rowsPerPage) {
        pages.push(combinedData.slice(i, i + rowsPerPage));
    }

    const namabulan = [
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

    const getNamaBulan = (bulan) => namabulan[bulan - 1];

    return (
        <div className="flex flex-col items-center bg-gray-100 py-10">
            {pages.map((pageData, pageIndex) => (
                <div
                    key={pageIndex}
                    className="bg-white shadow-lg p-4 mb-10"
                    style={{
                        width: "297mm",
                        height: "210mm", // Landscape A4
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                    }}
                >
                    {/* Header Laporan */}
                    <div className="flex -mb-4 p-10">
                        <div className="w-24 h-24 mr-2">
                            <img
                                src="/assets/img/login/sms.jpg"
                                alt="Login Image"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="font-bold text-base">
                                REKAP PRESENSI PEGAWAI
                            </h1>
                            <h1 className="font-bold text-base">
                                PERIODE {getNamaBulan(bulan).toUpperCase()}{" "}
                                {tahun}
                            </h1>
                            <h1 className="font-bold text-base">
                                PT.SIDOREJO MAKMUR SEJAHTERA
                            </h1>
                            <h1 className="text-xs text-slate-600 italic">
                                Jl. Raya Semarang - Demak Km. 13, Bandungrejo,
                                Kec. Mranggen, Kabupaten Demak, Jawa Tengah
                                59567
                            </h1>
                        </div>
                    </div>

                    {/* Tabel Presensi */}
                    <div className="overflow-auto max-h-[170mm] p-8">
                        <table className="table-auto border-collapse border border-gray-400 w-full text-xs">
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th
                                        className="border border-gray-400 px-1 py-1"
                                        rowSpan="2"
                                    >
                                        No
                                    </th>

                                    <th
                                        className="border border-gray-400 px-1 py-1"
                                        rowSpan="2"
                                    >
                                        Nama Karyawan
                                    </th>
                                    <th
                                        className="border border-gray-400 px-1 py-1"
                                        colSpan={31}
                                    >
                                        Tanggal
                                    </th>
                                    <th
                                        className="border border-gray-400 px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TH
                                    </th>
                                    <th
                                        className="border border-gray-400 px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TT
                                    </th>
                                </tr>
                                <tr className="bg-gray-200 text-center">
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <th
                                            key={i + 1}
                                            className="border border-gray-400 px-1 py-1"
                                        >
                                            {i + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {pageData.map((presensi, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border border-gray-400 px-1 py-1">
                                            {index + 1}
                                        </td>
                                        <td className="border border-gray-400 px-1 py-1 text-left">
                                            {presensi.nama_lengkap}
                                        </td>
                                        {presensi.presensi.map((pres, i) => (
                                            <td
                                                key={`in-${i}`}
                                                className="border border-gray-400 px-1 py-1"
                                            >
                                                {pres.jam_in}
                                                <br />
                                                <span className="text-gray-600 text-xxs">
                                                    {pres.jam_out}
                                                </span>
                                            </td>
                                        ))}
                                        <td className="border border-gray-400 px-1 py-1">
                                            {presensi.total_presensi}
                                        </td>
                                        <td className="border border-gray-400 px-1 py-1">
                                            {presensi.jumlah_keterlambatan}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Tambahkan gaya untuk mencetak */}
            <style>
                {`
                  @media print {
                    div, table {
                        page-break-inside: avoid;
                        overflow: visible !important;
                    }

                    table {
                        width: 100%;
                    }

                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }

                    body {
                        -webkit-print-color-adjust: exact;
                    }
                }

                `}
            </style>
        </div>
    );
}
