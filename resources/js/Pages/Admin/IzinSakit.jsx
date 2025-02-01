import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";

export default function IzinSakit({ dataIzinSakit }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = dataIzinSakit.filter(
        (data) =>
            data.nama_lengkap
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            data.tanggal_izin.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <div className="relative flex items-center mb-6 max-w-96">
                                <FiSearch className="absolute left-3 text-gray-400" />
                                <input
                                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                    type="text"
                                    placeholder="Cari berdasarkan nama atau tanggal izin"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <table className="w-full border-collapse text-center">
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
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((data, index) => (
                                        <tr
                                            key={data.id}
                                            className="even:bg-gray-50"
                                        >
                                            <td className="px-4 py-2 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {data.nama_lengkap}
                                            </td>
                                            <td className="px-2 py-2">
                                                {data.tanggal_izin}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {data.status == "i" ? (
                                                    <span className="bg-orange-500 px-4 py-1 text-white rounded-lg">
                                                        Izin
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-500 px-4 py-1 text-white rounded-lg">
                                                        Sakit
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {data.keterangan}
                                            </td>
                                            <td className="px-4 py-2">
                                                {data.status_approved ? (
                                                    data.status_approved ==
                                                    0 ? (
                                                        <span className="bg-orange-500 px-4 py-1 rounded-lg text-white">
                                                            pending
                                                        </span>
                                                    ) : data.status_approved ==
                                                      1 ? (
                                                        <span className="bg-green-500 px-4 py-1 rounded-lg text-white">
                                                            Disetujui
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-500 px-4 py-1 rounded-lg text-white">
                                                            Ditolak
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="bg-red-500 px-4 py-1 rounded-lg text-white">
                                                        Ditolak
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 flex">
                                                <button
                                                    onClick={() =>
                                                        handleApproval(
                                                            data.id,
                                                            "1"
                                                        )
                                                    }
                                                    className="bg-green-500 px-4 py-1 text-white rounded-lg hover:bg-green-700 mr-2"
                                                >
                                                    Setujui
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                }
            />
        </>
    );
}
