import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Modal from "@/Components/Modal";
import { FaEdit } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

export default function listPegawai({ pegawai }) {
    const [searchTerm, setSearchTerm] = useState(""); // State untuk kata kunci pencarian
    const [currentPage, setCurrentPage] = useState(0); // State untuk halaman saat ini
    const itemsPerPage = 10; // Jumlah data per halaman
    const { data, setData, post, errors, processing } = useForm({
        //useForm untuk store ke database
        Nama_Lengkap: "",
        Email: "",
        Posisi: "",
        No_Hp: "",
        Foto: null,
        Tempat_Lahir: "",
        Tanggal_Lahir: "",
    });

    // modal
    const [showModal, setShowModal] = useState(false); // State untuk modal tambah Pegawai
    // modal tambah pegawai
    const openModal = () => setShowModal(true); // Buka modal
    const closeModal = () => setShowModal(false); // Tutup modal

    // flash Message
    const { flash } = usePage().props; // Ambil flash dari props
    const [flashScss, setFlashScss] = useState(null); // State flash message

    useEffect(() => {
        if (flash.success) {
            setFlashScss(flash.success); // Perbarui state flashScss
            const timer = setTimeout(() => {
                setFlashScss(null); // Hapus flash setelah 2 detik
            }, 6000);

            return () => clearTimeout(timer); // Bersihkan timer jika komponen di-unmount
        }
    }, [flash.success]);

    // Filter data berdasarkan kata kunci pencarian
    const filteredPegawai = pegawai.filter(
        (pgw) =>
            pgw.Nama_Lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pgw.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pgw.Posisi.toLowerCase().includes(searchTerm.toLowerCase())
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
                    Nama_Lengkap: "",
                    Email: "",
                    Posisi: "",
                    No_Hp: "",
                    Foto: null,
                    Tempat_Lahir: "",
                    Tanggal_Lahir: "",
                });
            },
        });
    }

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Daftar Pegawai
                    </h2>
                }
                children={
                    <>
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <Head title="List Pegawai" />
                            <div className="max-w-screen-xl mx-auto p-6 rounded-md">
                                {/* Tombol Tambah Pegawai */}
                                {flashScss && (
                                    <div className="absolute top-24 right-6 bg-green-500 p-2 rounded-md shadow-lg text-sm text-white">
                                        {flashScss}
                                    </div>
                                )}

                                <div className="mb-6 flex justify-between">
                                    <button
                                        className="bg-blue-950 text-white w-44 rounded-lg flex text-sm"
                                        onClick={openModal}
                                    >
                                        <div className="mx-2 my-auto">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                />
                                                <path d="M12 5l0 14" />
                                                <path d="M5 12l14 0" />
                                            </svg>
                                        </div>
                                        <span className="my-auto">
                                            Tambah Pegawai
                                        </span>
                                    </button>
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
                                                                data.Nama_Lengkap
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "Nama_Lengkap",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.Nama_Lengkap && (
                                                        <p className="error ml-12">
                                                            {
                                                                errors.Nama_Lengkap
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
                                                            placeholder="Email"
                                                            value={data.Email}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "Email",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.Email && (
                                                        <p className="error ml-12">
                                                            {errors.Email}
                                                        </p>
                                                    )}
                                                    <div className="flex">
                                                        <span className="my-auto">
                                                            Posisi:
                                                        </span>
                                                        <input
                                                            className="ml-2 block w-full mt-3 rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white"
                                                            type="text"
                                                            placeholder="Posisi"
                                                            value={data.Posisi}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "Posisi",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.Posisi && (
                                                        <p className="error ml-12">
                                                            {errors.Posisi}
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
                                                            value={data.No_Hp}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "No_Hp",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.No_Hp && (
                                                        <p className="error ml-12">
                                                            {errors.No_Hp}
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
                                                                    "Foto",
                                                                    e.target
                                                                        .files[0]
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.Foto && (
                                                        <p className="error ml-12">
                                                            {errors.Foto}
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
                                                                data.Tempat_Lahir
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "Tempat_Lahir",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.Tempat_Lahir && (
                                                        <p className="error ml-24">
                                                            {
                                                                errors.Tempat_Lahir
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
                                                                data.Tanggal_Lahir
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "Tanggal_Lahir",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {errors.Tanggal_Lahir && (
                                                        <p className="error ml-24">
                                                            {
                                                                errors.Tanggal_Lahir
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
                                    {/* Input Search */}
                                    <input
                                        type="text"
                                        placeholder="Cari pegawai..."
                                        className="border border-gray-300 rounded-md p-2 w-full sm:w-1/3"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(0); // Reset halaman ke 0 saat pencarian berubah
                                        }}
                                    />
                                </div>

                                {/* Tabel Data Pegawai */}
                                <table className="w-full border-collapse border border-gray-300 text-left">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 border border-gray-300">
                                                No
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">
                                                Nama
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">
                                                Email
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">
                                                Posisi
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">
                                                No Hp
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">
                                                Foto
                                            </th>
                                            <th className="px-4 py-2 border border-gray-300">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedPegawai.length > 0 ? (
                                            paginatedPegawai.map(
                                                (pgw, index) => (
                                                    <tr
                                                        key={pgw.id}
                                                        className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                                                    >
                                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                                            {currentPage *
                                                                itemsPerPage +
                                                                index +
                                                                1}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            {pgw.Nama_Lengkap}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            {pgw.Email}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            {pgw.Posisi}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300">
                                                            {pgw.No_Hp}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                                            <img
                                                                src={
                                                                    pgw.Foto
                                                                        ? `/storage/${pgw.Foto}`
                                                                        : "/assets/img/nophoto.png"
                                                                }
                                                                alt="Foto Pegawai"
                                                                className="w-12 h-12 object-cover rounded-md"
                                                            />
                                                        </td>
                                                        <td className=" border border-gray-300 text-center">
                                                            <div className="flex justify-center text-slate-500">
                                                                <Link
                                                                    href={route(
                                                                        "pegawai.edit",
                                                                        pgw
                                                                    )}
                                                                >
                                                                    <FaEdit className="h-5 w-5 hover:text-blue-500" />
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "konfigurasi.show",
                                                                        pgw
                                                                    )}
                                                                >
                                                                    <IoIosSettings className="h-5 w-5 ml-1 hover:text-blue-500" />
                                                                </Link>
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

                                {/* Pagination */}
                                <div className="mt-6 ">
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
                        </div>
                    </>
                }
            />
        </>
    );
}
