import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import ReactPaginate from "react-paginate";

export default function MonitoringPresensi({ presensi, statusPresensi }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Jumlah item per halaman

    // Fungsi untuk memfilter data berdasarkan input pencarian
    const filteredPresensi = presensi.filter((psn) =>
        `${psn.Nama} ${psn.email} ${psn.Tanggal_presensi} ${psn.jam_in} ${psn.jam_out} ${psn.lokasi_in} ${psn.lokasi_out}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Data untuk halaman yang sedang ditampilkan
    const pageCount = Math.ceil(filteredPresensi.length / itemsPerPage);
    const paginatedPresensi = filteredPresensi.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Fungsi untuk menangani perubahan halaman
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    console.log(statusPresensi);

    return (
        <>
            <AuthenticatedLayout
                header={<h1>Monitoring Presensi Pegawai</h1>}
                children={
                    <>
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <Head title="Monitoring Pegawai" />
                            <div className="mx-auto max-w-7xl">
                                <div className="relative flex items-center mb-6 max-w-96">
                                    <FiSearch className="absolute left-3 text-gray-400" />
                                    <input
                                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                        type="text"
                                        placeholder="Cari berdasarkan nama, email, tanggal, dll..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="my-6 overflow-scroll">
                                    {/* Table presensi pegawai */}
                                    <table className="w-full border-collapse border border-gray-300 text-left">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-7 py-2 border border-gray-300">
                                                    No
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300">
                                                    Nama
                                                </th>
                                                <th className="px-2 py-2 border border-gray-300">
                                                    Email
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                    Tanggal Presensi
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                    Jam Masuk
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                    Jam Keluar
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                    Foto Masuk
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                    Foto Keluar
                                                </th>
                                                <th className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                    Keterangan
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedPresensi.length > 0 ? (
                                                paginatedPresensi.map(
                                                    (psn, index) => {
                                                        // Logika menentukan apakah terlambat
                                                        const isTerlambat =
                                                            statusPresensi.find(
                                                                (status) =>
                                                                    status.Nama ===
                                                                        psn.Nama &&
                                                                    status.Tanggal_presensi ===
                                                                        psn.Tanggal_presensi
                                                            )
                                                                ?.status_terlambat ===
                                                            "Terlambat";

                                                        return (
                                                            <tr
                                                                key={
                                                                    psn.id ||
                                                                    index
                                                                }
                                                                className="even:bg-gray-50"
                                                            >
                                                                <td className="px-7 py-2 border border-gray-300 text-center">
                                                                    {currentPage *
                                                                        itemsPerPage +
                                                                        index +
                                                                        1}
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                                    {psn.Nama}
                                                                </td>
                                                                <td className="px-2 py-2 border border-gray-300">
                                                                    {psn.email}
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                                    {
                                                                        psn.Tanggal_presensi
                                                                    }
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300">
                                                                    {psn.jam_in}
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300">
                                                                    {psn.jam_out ? (
                                                                        psn.jam_out
                                                                    ) : (
                                                                        <span className="bg-red-600 text-white rounded px-3 text-center py-1 whitespace-nowrap">
                                                                            Belum
                                                                            Absen
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300">
                                                                    <img
                                                                        src={
                                                                            psn.foto_in
                                                                                ? `/storage/uploads/absensi/${psn.foto_in}`
                                                                                : "assets/img/nophoto.png"
                                                                        }
                                                                        alt="Foto Masuk"
                                                                        className="h-12 w-12 object-cover"
                                                                    />
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300">
                                                                    <img
                                                                        src={
                                                                            psn.foto_out
                                                                                ? `/storage/uploads/absensi/${psn.foto_out}`
                                                                                : "/assets/img/nophoto.png"
                                                                        }
                                                                        alt="Foto Keluar"
                                                                        className="h-12 w-12 object-cover"
                                                                    />
                                                                </td>
                                                                <td className="px-7 py-2 border border-gray-300 whitespace-nowrap">
                                                                    {isTerlambat ? (
                                                                        <span className="bg-red-600 text-white px-2 py-1 rounded">
                                                                            Terlambat
                                                                        </span>
                                                                    ) : (
                                                                        <span className="bg-green-600 text-white px-2 py-1 rounded">
                                                                            Tepat
                                                                            Waktu
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="10"
                                                        className="text-center py-4 text-gray-500"
                                                    >
                                                        Tidak ada data presensi
                                                        tersedia
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6">
                                <ReactPaginate
                                    previousLabel={"← Sebelumnya"}
                                    nextLabel={"Selanjutnya →"}
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    containerClassName={
                                        "flex justify-center space-x-2"
                                    }
                                    pageClassName={
                                        "px-4 py-2 border border-gray-300"
                                    }
                                    previousClassName={
                                        "px-4 py-2 border border-gray-300"
                                    }
                                    nextClassName={
                                        "px-4 py-2 border border-gray-300"
                                    }
                                    activeClassName={
                                        "bg-blue-500 text-white font-bold"
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
