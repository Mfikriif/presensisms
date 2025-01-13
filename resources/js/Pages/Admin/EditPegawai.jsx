import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function EditPegawai({ pegawai }) {
    const [showEditModal, setShowEditModal] = useState(false); // State untuk mengontrol modal untuk modal edit pegawai
    // modal edit pegawai
    const openEditModal = () => setShowEditModal(true); // Buka modal
    const closeEditModal = () => setShowEditModal(false); // Tutup modal

    // flash Message
    const { flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(null);
    useEffect(() => {
        if (flash.success) {
            setFlashMsg(flash.success);
            const timer = setTimeout(() => {
                setFlashMsg(null);
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const {
        data,
        setData,
        put,
        delete: destroy,
        errors,
        processing,
    } = useForm({
        Nama_Lengkap: pegawai.Nama_Lengkap,
        Posisi: pegawai.Posisi,
        Email: pegawai.Email,
        Tempat_Lahir: pegawai.Tempat_Lahir,
        Tanggal_Lahir: pegawai.Tanggal_Lahir,
        No_Hp: pegawai.No_Hp,
    });

    function handleUpdate(e) {
        e.preventDefault();
        put(route("pegawai.update", { pegawai: pegawai.id }), {
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

    function handleDestroy(e) {
        e.preventDefault();
        destroy(route("pegawai.destroy", { pegawai: pegawai.id }), {
            onSuccess: () => {
                console.log("Pegawai berhasil dihapus");
            },
            onError: (errors) => {
                console.error("Terjadi kesalahan:", errors);
            },
        });
    }

    return (
        <>
            <AuthenticatedLayout
                header={
                    <>
                        <h2>Edit Pegawai</h2>
                    </>
                }
                children={
                    <>
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <Head title="Edit Pegawai" />

                            {flashMsg && (
                                <div className="absolute top-24 right-6 bg-green-500 p-2 rounded-md shadow-lg text-sm text-white">
                                    {flashMsg}
                                </div>
                            )}

                            {/* Informasi Detail Pegawai */}
                            <div className="max-w-5xl p-10">
                                <div className="w-20 h-20 rounded-full overflow-hidden ml-10">
                                    <img
                                        src={`/storage/${pegawai.Foto}`}
                                        alt="foto-pegawai"
                                    />
                                </div>

                                <div className="p-6">
                                    <table className="table-auto w-full border-collapse">
                                        <tbody>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    ID Pegawai
                                                </th>
                                                <td className=" px-6 py-4 text-gray-800">
                                                    {pegawai.id}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Nama
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {pegawai.Nama_Lengkap}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Posisi
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {pegawai.Posisi}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Email
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {pegawai.Email}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Tempat Lahir
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {pegawai.Tempat_Lahir}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Tanggal Lahir
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {pegawai.Tanggal_Lahir}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    No Telepon
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {pegawai.No_Hp}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex">
                                    <button
                                        className="bg-blue-900 hover:bg-blue-950 text-white px-5 py-1 rounded ml-10"
                                        onClick={openEditModal}
                                    >
                                        Edit
                                    </button>
                                    <form action="" onSubmit={handleDestroy}>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-1 rounded ml-4">
                                            Hapus
                                        </button>
                                    </form>
                                </div>
                                <Modal
                                    show={showEditModal}
                                    maxWidth="2xl"
                                    closeable={true}
                                    onClose={closeEditModal} // Fungsi untuk menutup modal
                                >
                                    <div className="p-6">
                                        <p className="text-2xl font-bold">
                                            Edit Data Pegawai
                                        </p>
                                        <div className="text-sm">
                                            <form onSubmit={handleUpdate}>
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
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.Nama_Lengkap && (
                                                    <p className="error ml-12">
                                                        {errors.Nama_Lengkap}
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
                                                                e.target.value
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
                                                                e.target.value
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
                                                                e.target.value
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
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.Tempat_Lahir && (
                                                    <p className="error ml-24">
                                                        {errors.Tempat_Lahir}
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
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {errors.Tanggal_Lahir && (
                                                    <p className="error ml-24">
                                                        {errors.Tanggal_Lahir}
                                                    </p>
                                                )}

                                                <button
                                                    className="mt-6 ml-48 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950"
                                                    disabled={processing}
                                                >
                                                    Simpan Perubahan
                                                </button>
                                            </form>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                onClick={closeEditModal}
                                            >
                                                Batalkan
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
