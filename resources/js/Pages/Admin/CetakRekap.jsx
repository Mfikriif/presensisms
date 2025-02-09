export default function CetakRekap({
    rekapPresensi,
    rekapKeterlambatan,
    bulan,
    tahun,
}) {
    const rowsPerPage = 5;

    const groupedData = rekapPresensi.reduce((acc, item) => {
        const {
            kode_pegawai,
            nama_lengkap,
            tanggal_presensi,
            jam_in,
            jam_out,
            total_izin,
            total_sakit,
        } = item;

        if (!acc[kode_pegawai]) {
            acc[kode_pegawai] = {
                kode_pegawai,
                nama_lengkap,
                total_izin,
                total_sakit,
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
        "November",
        "Desember",
    ];

    const getNamaBulan = (bulan) => namabulan[bulan - 1];

    console.log(rekapPresensi);

    return (
        <div className="flex flex-col items-center bg-gray-100 py-10">
            {pages.map((pageData, pageIndex) => (
                <div
                    key={pageIndex}
                    className="bg-white shadow-lg p-4 page"
                    style={{
                        width: "297mm",
                        height: "210mm",
                        overflow: "hidden",
                        pageBreakAfter: "always",
                    }}
                >
                    {/* Header Laporan */}
                    <div className="flex mb-4">
                        <div className="w-24 h-24 mr-2">
                            <img
                                src="/assets/img/login/sms.jpg"
                                alt="Logo"
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
                                PT. SIDOREJO MAKMUR SEJAHTERA
                            </h1>
                            <h1 className="text-xs text-slate-600 italic">
                                Jl. Raya Semarang - Demak Km. 13, Bandungrejo,
                                Kec. Mranggen, Kabupaten Demak, Jawa Tengah
                                59567
                            </h1>
                        </div>
                    </div>

                    {/* Bagian Tabel Presensi */}
                    <div>
                        {/* Tabel Tanggal 1-15 */}
                        <table
                            className="table-auto border-collapse w-full text-xs mb-8"
                            style={{ pageBreakInside: "avoid" }}
                        >
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        No
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        Nama Karyawan
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        colSpan={15}
                                    >
                                        Tanggal
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TH
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TT
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TS
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TI
                                    </th>
                                </tr>
                                <tr className="bg-gray-200 text-center">
                                    {Array.from({ length: 15 }, (_, i) => (
                                        <th
                                            key={i + 1}
                                            className="border px-1 py-1"
                                        >
                                            {i + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.map((presensi, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border px-1 py-1">
                                            {index + 1}
                                        </td>
                                        <td className="border px-1 py-1 text-left">
                                            {presensi.nama_lengkap}
                                        </td>
                                        {presensi.presensi
                                            .slice(0, 15)
                                            .map((pres, i) => (
                                                <td
                                                    key={`in-${i}`}
                                                    className="border px-1 py-1"
                                                >
                                                    {pres.jam_in}
                                                    <br />
                                                    <span className="text-gray-600 text-xxs">
                                                        {pres.jam_out}
                                                    </span>
                                                </td>
                                            ))}
                                        <td className="border px-1 py-1">
                                            {presensi.total_presensi}
                                        </td>
                                        <td className="border px-1 py-1">
                                            {presensi.jumlah_keterlambatan}
                                        </td>
                                        <td className="border px-1 py-1">
                                            {presensi.total_sakit === "1"
                                                ? presensi.total_sakit
                                                : "-"}
                                        </td>
                                        <td className="border px-1 py-1">
                                            {presensi.total_izin === "1"
                                                ? presensi.total_izin
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Tabel Tanggal 16-31 */}
                        <table
                            className="table-auto border-collapse w-full text-xs"
                            style={{ pageBreakInside: "avoid" }}
                        >
                            <thead>
                                <tr className="bg-gray-200 text-center">
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        No
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        Nama Karyawan
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        colSpan={16}
                                    >
                                        Tanggal
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TH
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TT
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TS
                                    </th>
                                    <th
                                        className="border px-1 py-1"
                                        rowSpan="2"
                                    >
                                        TI
                                    </th>
                                </tr>
                                <tr className="bg-gray-200 text-center">
                                    {Array.from({ length: 16 }, (_, i) => (
                                        <th
                                            key={i + 16}
                                            className="border px-1 py-1"
                                        >
                                            {i + 16}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.map((presensi, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border px-1 py-1">
                                            {index + 1}
                                        </td>
                                        <td className="border px-1 py-1 text-left">
                                            {presensi.nama_lengkap}
                                        </td>
                                        {presensi.presensi
                                            .slice(15)
                                            .map((pres, i) => (
                                                <td
                                                    key={`out-${i + 15}`}
                                                    className="border px-1 py-1"
                                                >
                                                    {pres.jam_in}
                                                    <br />
                                                    <span className="text-gray-600 text-xxs">
                                                        {pres.jam_out}
                                                    </span>
                                                </td>
                                            ))}
                                        <td className="border px-1 py-1">
                                            {presensi.total_presensi}
                                        </td>
                                        <td className="border px-1 py-1">
                                            {presensi.jumlah_keterlambatan}
                                        </td>
                                        <td className="border px-1 py-1">
                                            {presensi.total_sakit === "1"
                                                ? presensi.total_sakit
                                                : "-"}
                                        </td>
                                        <td className="border px-1 py-1">
                                            {presensi.total_izin === "1"
                                                ? presensi.total_izin
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* CSS tambahan */}
            <style>
                {`
                @media print {
                    .page {
                        
                        page-break-before: auto;
                        
                    }
                    .page:last-child {
                        page-break-after: auto;
                    }

                    .page-empty {
                        display: none;
                    }


                    table {
                        width: 100%;
                        max-width: 290mm;
                    }

                    th, td {
                        border: 1px solid #000;
                        page-break-inside: avoid;
                        page-break-before: auto;
                        padding: 2px;
                        border: 1px solid #000;
                        page-break-inside: avoid;

                    }

                    .content {
                        margin: 0;
                        padding: 0;
                        border: 0;
                    }

                    @page {
                        size: A4 landscape;
                        margin: 5mm;
                    }
                }


                `}
            </style>
        </div>
    );
}
