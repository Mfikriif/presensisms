import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function listPegawai({ pegawai }) {
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
                        <Head title="List Pegawai" />

                        <div className="max-w-screen-xl mx-auto p-6 rounded-md">
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
                                            Tempat Lahir
                                        </th>
                                        <th className="px-4 py-2 border border-gray-300">
                                            Tanggal Lahir
                                        </th>
                                        <th className="px-4 py-2 border border-gray-300">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pegawai.data.map((pgw, index) => (
                                        <tr
                                            key={pgw.id}
                                            className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                                        >
                                            <td className="px-4 py-2 border border-gray-300 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {pgw.Nama_Lengkap}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {pgw.Email}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {pgw.Tempat_Lahir}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {pgw.Tanggal_Lahir}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">
                                                <Link className="text-blue-500 underline hover:text-blue-700">
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="py-12 px-3 text-center">
                                {pegawai.links.map((link) =>
                                    link.url ? (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`p-1 mx-1 ${
                                                link.active
                                                    ? "text-blue-500 font-bold"
                                                    : " "
                                            }`}
                                        />
                                    ) : (
                                        <span
                                            key={link.label}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className="p-1 mx-1 text-slate-300"
                                        ></span>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
