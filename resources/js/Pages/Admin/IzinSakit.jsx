import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";

export default function IzinSakit({ dataIzinSakit }) {
    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("pending");

    const filtered = dataIzinSakit.filter((data) => {
        const status = data.status_approved;
        const matchesSearchTerm =
            data.tanggal_izin
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            data.namaPengaju.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter berdasarkan status yang dipilih
        let statusMatches = false;
        if (statusFilter === "pending") {
            statusMatches = status === "0" || status === null;
        } else if (statusFilter === "approved") {
            statusMatches = status === "1";
        } else if (statusFilter === "rejected") {
            statusMatches = status === "2";
        } else {
            // "all"
            statusMatches = true;
        }

        return matchesSearchTerm && statusMatches;
    });

    const handleApproval = async (id, status) => {
        // Simpan promise dari axios
        const promise = axios.post(route("izin.update", id), {
            status_approved: status,
        });

        // Gunakan toast.promise untuk menangani promise
        toast.promise(promise, {
            loading: "Sedang memproses...",
            success: (response) => {
                // Reload halaman setelah 3 detik jika sukses
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                return "Status perizinan berhasil diperbarui!";
            },
            error: (error) => {
                console.error("Error:", error);
                return "Terjadi kesalahan saat memperbarui status.";
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout
                header={<>Izin / Sakit</>}
                children={
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <input
                                className="pl-10 pr-4 py-2 my-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-2/6"
                                type="text"
                                placeholder="Cari berdasarkan nama atau tanggal izin"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    // Ubah state isToday menjadi false saat sedang mencari
                                    setToday(
                                        e.target.value === "" ? true : false
                                    );
                                }}
                            />
                            {/* Filter status */}
                            <div className="flex gap-2 mb-4 font-semibold">
                                <button
                                    onClick={() => setStatusFilter("pending")}
                                    className={`px-4 py-2 rounded-lg ${
                                        statusFilter === "pending"
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setStatusFilter("approved")}
                                    className={`px-4 py-2 rounded-lg ${
                                        statusFilter === "approved"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Disetujui
                                </button>
                                <button
                                    onClick={() => setStatusFilter("rejected")}
                                    className={`px-4 py-2 rounded-lg ${
                                        statusFilter === "rejected"
                                            ? "bg-red-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Ditolak
                                </button>
                                <button
                                    onClick={() => setStatusFilter("all")}
                                    className={`px-4 py-2 rounded-lg ${
                                        statusFilter === "all"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    Semua
                                </button>
                            </div>
                        </div>

                        {/* <div className="p-6 bg-white shadow-md rounded-lg"> */}
                        <table className="p-6 bg-white shadow-2xl rounded-2xl w-full border-collapse text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">No</th>
                                    <th className="px-4 py-2">Nama</th>
                                    <th className="px-2 py-2 ">
                                        Tanggal Izin / Sakit
                                    </th>
                                    <th className="px-4 py-2 whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 whitespace-nowrap">
                                        Keterangan
                                    </th>
                                    <th className="px-4 py-2 whitespace-nowrap">
                                        Status Approved
                                    </th>
                                    <th className="px-4 py-2 whitespace-nowrap">
                                        Bukti Surat
                                    </th>
                                    <th className="px-4 py-2 whitespace-nowrap">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((data, index) => (
                                    <tr
                                        key={data.id}
                                        className="even:bg-gray-50 border-b border-gray-300"
                                    >
                                        <td className="px-4 py-2 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {data.namaPengaju}
                                        </td>
                                        <td className="px-2 py-2">
                                            {data.tanggal_izin}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {data.status == "i" ? (
                                                <span className="bg-yellow-200 px-4 py-1 text-yellow-600 font-semibold rounded-lg">
                                                    Izin
                                                </span>
                                            ) : (
                                                <span className="bg-red-300 px-4 py-1 text-red-600 font-semibold rounded-lg">
                                                    Sakit
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 max-w-xs break-words whitespace-normal">
                                            {data.keterangan}
                                        </td>
                                        <td className="px-4 py-2 ">
                                            {data.status_approved ? (
                                                data.status_approved == 0 ? (
                                                    <span className="bg-orange-300 px-4 py-1 rounded-lg text-orange-600 font-semibold">
                                                        pending
                                                    </span>
                                                ) : data.status_approved ==
                                                  1 ? (
                                                    <span className="bg-green-200 px-4 py-1 rounded-lg text-green-600 font-semibold">
                                                        Disetujui
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-200 px-4 py-1 rounded-lg text-red-600 font-semibold">
                                                        Ditolak
                                                    </span>
                                                )
                                            ) : (
                                                <span className="bg-red-300 px-4 py-1 rounded-lg text-red-600 font-semibold">
                                                    Ditolak
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {data.file_path ? (
                                                <a
                                                    className="bg-blue-800 text-white px-3 py-1 rounded-lg hover:bg-blue-900"
                                                    href={route(
                                                        "izin.showfile",

                                                        data.id
                                                    )}
                                                >
                                                    Download
                                                </a>
                                            ) : (
                                                <span></span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 flex justify-center">
                                            {data.status_approved === "1" ||
                                            data.status_approved === "2" ? (
                                                <button
                                                    onClick={() =>
                                                        handleApproval(
                                                            data.id,
                                                            "0"
                                                        )
                                                    }
                                                    className="bg-red-500 px-4 py-1 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <div>
                                                    <button
                                                        onClick={() =>
                                                            handleApproval(
                                                                data.id,
                                                                "1"
                                                            )
                                                        }
                                                        className="bg-green-500 px-4 py-1 text-white rounded-lg hover:bg-green-700 mr-2"
                                                    >
                                                        Setujui{" "}
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleApproval(
                                                                data.id,
                                                                "2"
                                                            )
                                                        }
                                                        className="bg-red-500 px-4 py-1 text-white rounded-lg hover:bg-red-700"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* </div> */}
                    </>
                }
            />
        </>
    );
}
