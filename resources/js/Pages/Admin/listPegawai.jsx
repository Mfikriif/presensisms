import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Modal from "@/Components/Modal";
import { IoIosSettings } from "react-icons/io";
import { FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
import { AlertTriangle } from "lucide-react";

export default function listPegawai({ pegawai }) {
    const [searchTerm, setSearchTerm] = useState(""); // State untuk kata kunci pencarian
    const [currentPage, setCurrentPage] = useState(0); // State untuk halaman saat ini
    const itemsPerPage = 10; // Jumlah data per halaman
    const {
        data,
        setData,
        post,
        delete: destroy,
        errors,
        processing,
    } = useForm({
        //useForm untuk store ke database
        nama_lengkap: "",
        email: "",
        posisi: "",
        no_hp: "",
        foto: null,
        tempat_lahir: "",
        tanggal_lahir: "",
    });

    // modal
    const [showModal, setShowModal] = useState(false); // State untuk modal tambah Pegawai
    // modal tambah pegawai
    const openModal = () => setShowModal(true); // Buka modal
    const closeModal = () => setShowModal(false); // Tutup modal

    // Filter data berdasarkan kata kunci pencarian
    const filteredPegawai = pegawai.filter(
        (pgw) =>
            pgw.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pgw.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pgw.posisi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Data pegawai untuk halaman yang sedang ditampilkan
    const pageCount = Math.ceil(filteredPegawai.length / itemsPerPage);
    const paginatedPegawai = filteredPegawai.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Fungsi untuk menangani perubahan halaman
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Fungsi handle submit
    function submitHandle(e) {
        e.preventDefault();
        post(route("pegawai.store"), {
            onSuccess: () => {
                setData({
                    nama_lengkap: "",
                    email: "",
                    posisi: "",
                    no_hp: "",
                    foto: null,
                    tempat_lahir: "",
                    tanggal_lahir: "",
                });
                // <Toaster richColors />;
                closeModal();
                toast.success("Pegawai baru berhasil di tambahkan");
            },
        });
    }

    function confirmDestroy(toastId) {
        // Hapus data setelah konfirmasi
        destroy(route("pegawai.destroy", pegawai), {
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success("Pegawai berhasil dihapus");
            },
            onError: () => {
                toast.dismiss(toastId);
                toast.error("Terjadi kesalahan saat menghapus data");
            },
        });
    }

    function handleDestroy(e) {
        e.preventDefault();

        // Tampilkan alert konfirmasi sebelum menghapus data
        toast(
            (t) => (
                <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-600 w-20 h-20" />
                        <p className="text-lg font-semibold text-red-600">
                            Apakah Anda yakin ingin menghapus data ini?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => confirmDestroy(t)}
                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            OK
                        </button>
                        <button
                            onClick={() => toast.dismiss(t)}
                            className="px-4 py-2 text-red-600 bg-red-200 rounded-lg hover:bg-red-300"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity }
        );
    }

    return (
        <>
            <AuthenticatedLayout
                header={<>Daftar Pegawai</>}
                children={
                    <>
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl">
                            <Head title="List Pegawai" />
                            <div className="flex p-6 justify-between">
                                <button
                                    className="bg-blue-950 text-white my-auto py-2 px-4 rounded-lg flex text-sm"
                                    onClick={openModal}
                                >
                                    <FaPlus className="my-auto mr-2" />
                                    Tambah Pegawai
                                </button>
                                {/* Input Search */}
                                <input
                                    type="text"
                                    placeholder="Cari pegawai..."
                                    className="border border-gray-300 rounded-2xl p-2 w-full sm:w-1/3"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(0); // Reset halaman ke 0 saat pencarian berubah
                                    }}
                                />
                            </div>
                            <div className="mx-auto border rounded-2xl shadow-2xl">
                                <div className="mb-6 flex justify-between">
                                    {/* Modal */}
                                    <Modal
                                        show={showModal}
                                        maxWidth="2xl"
                                        closeable={true}
                                        onClose={closeModal} // Fungsi untuk menutup modal
                                    >
                                        <div className="p-6">
                                            <p className="text-2xl font-bold">
                                                Tambah Pegawai
                                            </p>
                                            <div className="text-sm">
                                                <form
                                                    onSubmit={submitHandle}
                                                    encType="multipart/form-data"
                                                >
                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Nama:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="text"
                                                            placeholder="Nama Lengkap"
                                                            value={
                                                                data.nama_lengkap
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "nama_lengkap",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.nama_lengkap && (
                                                        <p className="error ml-12">
                                                            {
                                                                errors.nama_lengkap
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Email:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="text"
                                                            placeholder="email"
                                                            value={data.email}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "email",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <p className="error ml-12">
                                                            {errors.email}
                                                        </p>
                                                    )}

                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Jabatan:
                                                        </span>
                                                        <select
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            value={data.posisi}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "posisi",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Pilih Jabatan
                                                            </option>
                                                            <option value="staff">
                                                                Staff
                                                            </option>
                                                            <option value="operator">
                                                                Operator
                                                            </option>
                                                            <option value="Cleaning Service">
                                                                Cleaning Service
                                                            </option>
                                                            <option value="Security">
                                                                Security
                                                            </option>
                                                        </select>
                                                    </div>
                                                    {errors.posisi && (
                                                        <p className="error ml-12">
                                                            {errors.posisi}
                                                        </p>
                                                    )}

                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            No HP:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="text"
                                                            placeholder="Nomor Hand Phone"
                                                            value={data.no_hp}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "no_hp",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.no_hp && (
                                                        <p className="error ml-12">
                                                            {errors.no_hp}
                                                        </p>
                                                    )}

                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Foto:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="file"
                                                            onChange={(e) =>
                                                                setData(
                                                                    "foto",
                                                                    e.target
                                                                        .files[0]
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.foto && (
                                                        <p className="error ml-12">
                                                            {errors.foto}
                                                        </p>
                                                    )}

                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Tempat Lahir:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="text"
                                                            placeholder="Tempat Lahir"
                                                            value={
                                                                data.tempat_lahir
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "tempat_lahir",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.tempat_lahir && (
                                                        <p className="error ml-24">
                                                            {
                                                                errors.tempat_lahir
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Tanggal Lahir:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="text"
                                                            placeholder="Tahun-Bulan-Tanggal"
                                                            value={
                                                                data.tanggal_lahir
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "tanggal_lahir",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.tanggal_lahir && (
                                                        <p className="error ml-24">
                                                            {
                                                                errors.tanggal_lahir
                                                            }
                                                        </p>
                                                    )}

                                                    <button
                                                        className="mt-6 ml-48 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950"
                                                        disabled={processing}
                                                    >
                                                        Simpan
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                    onClick={closeModal}
                                                >
                                                    Batalkan
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>

                                {/* Tabel Data Pegawai */}
                                <table className="w-full border-collapse text-left mb-3">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2">No</th>
                                            <th className="px-4 py-2">Nama</th>
                                            <th className="px-4 py-2">Email</th>
                                            <th className="px-4 py-2">
                                                Jabatan
                                            </th>
                                            <th className="px-4 py-2">No Hp</th>
                                            <th className="px-4 py-2">Foto</th>
                                            <th className="px-4 py-2">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedPegawai.length > 0 ? (
                                            paginatedPegawai.map(
                                                (pgw, index) => (
                                                    <tr
                                                        key={pgw.id}
                                                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                                                    >
                                                        <td className="px-4 py-2 text-center">
                                                            {currentPage *
                                                                itemsPerPage +
                                                                index +
                                                                1}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {pgw.nama_lengkap}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {pgw.email}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {pgw.posisi}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {pgw.no_hp}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <img
                                                                src={
                                                                    pgw.foto
                                                                        ? `/storage/${pgw.foto}`
                                                                        : "/assets/img/nophoto.png"
                                                                }
                                                                alt="foto Pegawai"
                                                                className="w-12 h-12 object-cover rounded-md"
                                                            />
                                                        </td>
                                                        <td className=" text-center">
                                                            <div className="flex justify-evenly">
                                                                <Link
                                                                    href={route(
                                                                        "pegawai.edit",
                                                                        pgw
                                                                    )}
                                                                >
                                                                    <div className="bg-green-300 p-1 rounded-lg text-green-600  items-center">
                                                                        <FaEdit className="h-5 w-5" />
                                                                    </div>
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "konfigurasi.show",
                                                                        pgw
                                                                    )}
                                                                >
                                                                    <div className="bg-blue-300 p-1 rounded-lg text-blue-600  items-center">
                                                                        <IoIosSettings className="h-5 w-5 " />
                                                                    </div>
                                                                </Link>
                                                                <button
                                                                    onClick={
                                                                        handleDestroy
                                                                    }
                                                                >
                                                                    <div className="bg-red-300 p-1 rounded-lg text-red-600  items-center">
                                                                        <MdDelete className="text-xl " />
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="text-center text-gray-500 py-4"
                                                >
                                                    Tidak ada pegawai yang cocok
                                                    dengan pencarian
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="my-6 ">
                                <ReactPaginate
                                    previousLabel={"← Sebelumnya"}
                                    nextLabel={"Selanjutnya →"}
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    containerClassName={
                                        "flex justify-center space-x-2"
                                    }
                                    pageClassName={"px-4 py-2"}
                                    previousClassName={"px-4 py-2"}
                                    nextClassName={"px-4 py-2"}
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
