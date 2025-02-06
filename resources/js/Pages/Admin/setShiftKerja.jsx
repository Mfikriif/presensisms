import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function setShiftJamKerja({ pegawai, jadwalShift }) {
    const { data, setData, post, errors, processing } = useForm({
        id: pegawai.id,
        nama: pegawai.nama_lengkap,
        shift: {
            senin: "",
            selasa: "",
            rabu: "",
            kamis: "",
            jumat: "",
            sabtu: "",
            minggu: "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData("shift", {
            ...data.shift,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("setShift.store"), {
            onSuccess: (response) => {
                // console.log("Success:", response);
                toast.success("Shift Pegawai berhasil di set");
            },
            onError: (errors) => {
                // console.log("Errors:", errors);
                toast.error("Terjadi kesalahan saat menyimpan data");
            },
        });
    };

    return (
        <>
            <AuthenticatedLayout
                header={<p>Set Shift Operator</p>}
                children={
                    <>
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <Head title="Set Shift Jam kerja" />
                            <div className="w-full p-10">
                                <div className="flex">
                                    <div className="w-20 h-20 rounded overflow-hidden mx-10">
                                        <img
                                            src={`/storage/${pegawai.foto}`}
                                            alt="foto-pegawai"
                                        />
                                    </div>

                                    <div className="px-6 max-w-xl max-h-96 overflow-hidden">
                                        <table className="table-auto w-full border-collapse">
                                            <tbody>
                                                <tr className="hover:bg-gray-50 border-b border-gray-300">
                                                    <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                        ID Pegawai
                                                    </th>
                                                    <td className="px-6 py-4 text-gray-800">
                                                        {pegawai.id}
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50 border-b border-gray-300">
                                                    <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                        Nama
                                                    </th>
                                                    <td className="px-6 py-4 text-gray-800">
                                                        {pegawai.nama_lengkap}
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50 border-b border-gray-300">
                                                    <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                        Posisi
                                                    </th>
                                                    <td className="px-6 py-4 text-gray-800">
                                                        {pegawai.posisi}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* Set Shift jam kerja pegawai */}
                                <div className="flex justify-evenly w-full mt-6">
                                    <form
                                        className="w-full mr-2"
                                        onSubmit={handleSubmit}
                                    >
                                        <table className="table-auto w-full border-collapse border border-gray-300 mr-3">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 border border-gray-300">
                                                        Hari
                                                    </th>
                                                    <th className="px-6 py-3 border border-gray-300">
                                                        Jam Kerja
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    "senin",
                                                    "selasa",
                                                    "rabu",
                                                    "kamis",
                                                    "jumat",
                                                    "sabtu",
                                                    "minggu",
                                                ].map((day) => (
                                                    <tr
                                                        key={day}
                                                        className="hover:bg-gray-50 border-b border-gray-300"
                                                    >
                                                        <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                            {day
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                day.slice(1)}
                                                        </th>
                                                        <td className="px-6 py-4 text-gray-800">
                                                            <select
                                                                name={day}
                                                                value={
                                                                    data.shift[
                                                                        day
                                                                    ]
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                className="w-full border border-gray-300 rounded-md"
                                                            >
                                                                <option value="">
                                                                    Pilih jam
                                                                    kerja
                                                                </option>
                                                                {jadwalShift.map(
                                                                    (shft) => (
                                                                        <option
                                                                            key={
                                                                                shft.kode_jamkerja
                                                                            }
                                                                            value={
                                                                                shft.kode_jamkerja
                                                                            }
                                                                        >
                                                                            {
                                                                                shft.nama_jamkerja
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {errors[
                                                                `shift.${day}`
                                                            ] && (
                                                                <p className="text-red-600 text-sm">
                                                                    {
                                                                        errors[
                                                                            `shift.${day}`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button
                                            type="submit"
                                            className="mt-4 px-4 py-2 w-full  bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Saving..."
                                                : "Simpan Jadwal"}
                                        </button>
                                    </form>

                                    {/* data master shift */}
                                    <table className="table-auto w-2/5 h-52 border-collapse border border-gray-300 text-sm whitespace-nowrap">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-2 py-1 border border-gray-300">
                                                    KODE
                                                </th>
                                                <th className="px-2 py-1 border border-gray-300">
                                                    NAMA
                                                </th>
                                                <th className="px-2 py-1 border border-gray-300">
                                                    AWAL MASUK
                                                </th>
                                                <th className="px-2 py-1 border border-gray-300">
                                                    JAM MASUK
                                                </th>
                                                <th className="px-2 py-1 border border-gray-300">
                                                    AKHIR MASUK
                                                </th>
                                                <th className="px-2 py-1 border border-gray-300">
                                                    JAM PULANG
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-semibold">
                                            {jadwalShift.map((shft) => (
                                                <tr
                                                    key={shft.kode_jamkerja}
                                                    className="odd:bg-white even:bg-gray-100 hover:bg-gray-100"
                                                >
                                                    <td className="px-2 border border-gray-300 leading-tight">
                                                        {shft.kode_jamkerja}
                                                    </td>
                                                    <td className="px-2 border border-gray-300 leading-tight">
                                                        {shft.nama_jamkerja}
                                                    </td>
                                                    <td className="px-2 border border-gray-300 leading-tight">
                                                        {shft.awal_jam_masuk}
                                                    </td>
                                                    <td className="px-2 border border-gray-300 leading-tight">
                                                        {shft.jam_masuk}
                                                    </td>
                                                    <td className="px-2 border border-gray-300 leading-tight">
                                                        {shft.akhir_jam_masuk}
                                                    </td>
                                                    <td className="px-2 border border-gray-300 leading-tight">
                                                        {shft.jam_pulang}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
