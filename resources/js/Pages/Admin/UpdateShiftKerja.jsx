import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function UpdateShiftKerja({ pegawai, jadwalShift, shift }) {
    const { data, setData, put, errors, processing } = useForm({
        id: pegawai.id,
        nama: pegawai.nama_lengkap,
        shift: {
            senin:
                shift.find((sht) => sht.hari.toLowerCase() === "senin")
                    ?.kode_jamkerja || "",
            selasa:
                shift.find((sht) => sht.hari.toLowerCase() === "selasa")
                    ?.kode_jamkerja || "",
            rabu:
                shift.find((sht) => sht.hari.toLowerCase() === "rabu")
                    ?.kode_jamkerja || "",
            kamis:
                shift.find((sht) => sht.hari.toLowerCase() === "kamis")
                    ?.kode_jamkerja || "",
            jumat:
                shift.find((sht) => sht.hari.toLowerCase() === "jumat")
                    ?.kode_jamkerja || "",
            sabtu:
                shift.find((sht) => sht.hari.toLowerCase() === "sabtu")
                    ?.kode_jamkerja || "",
            minggu:
                shift.find((sht) => sht.hari.toLowerCase() === "minggu")
                    ?.kode_jamkerja || "",
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target; // Ambil nama (key) dan nilai (value)
        setData("shift", {
            ...data.shift, // Salin data shift sebelumnya
            [name]: value, // Update shift berdasarkan hari
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(data); // Debug data sebelum pengiriman
        put(route("setShift.edit", { id: pegawai.id }), {
            onSuccess: () => {
                toast.success("Shift Pegawai berhasil di perbarui");
            },
        });
    };

    console.log("shift data from backend", shift);

    // console.log(shiftForDay);

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
                                        action=""
                                        onSubmit={handleEdit}
                                        className="w-full mr-2"
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
                                                    "Senin",
                                                    "Selasa",
                                                    "Rabu",
                                                    "Kamis",
                                                    "Jumat",
                                                    "Sabtu",
                                                    "Minggu",
                                                ].map((day) => {
                                                    // Cari data shift untuk hari tertentu
                                                    const shiftForDay =
                                                        shift.find(
                                                            (sht) =>
                                                                sht.hari.toLowerCase() ===
                                                                day.toLowerCase()
                                                        );

                                                    return (
                                                        <tr
                                                            key={day}
                                                            className="hover:bg-gray-50 border-b border-gray-300"
                                                        >
                                                            <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                                {day}
                                                            </th>
                                                            <td className="px-6 py-4 text-gray-800">
                                                                <select
                                                                    name={day.toLowerCase()} // Nama hari sebagai key
                                                                    value={
                                                                        data
                                                                            .shift[
                                                                            day.toLowerCase()
                                                                        ] !==
                                                                        undefined
                                                                            ? data
                                                                                  .shift[
                                                                                  day.toLowerCase()
                                                                              ]
                                                                            : shiftForDay?.kode_jamkerja ||
                                                                              ""
                                                                    }
                                                                    // Nilai default
                                                                    onChange={
                                                                        handleChange
                                                                    } // Tetap bisa dipilih pengguna
                                                                    className="w-full border border-gray-300 rounded-md"
                                                                >
                                                                    <option value="">
                                                                        Pilih
                                                                        jam
                                                                        kerja
                                                                    </option>
                                                                    {jadwalShift.map(
                                                                        (
                                                                            shft
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    shft.kode_jamkerja
                                                                                }
                                                                                value={
                                                                                    shft.kode_jamkerja
                                                                                }
                                                                            >
                                                                                {
                                                                                    shft.kode_jamkerja
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                                {errors[
                                                                    `shift.${day.toLowerCase()}`
                                                                ] && (
                                                                    <p className="text-red-600 text-sm">
                                                                        {
                                                                            errors[
                                                                                `shift.${day.toLowerCase()}`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <button
                                            type="submit"
                                            className="mt-4 px-4 py-2 w-full  bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Saving..."
                                                : "Simpan Perubahan Jadwal"}
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
