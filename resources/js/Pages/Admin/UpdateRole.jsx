import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function UpdateRole({ user }) {
    const { data, setData, put, post, processing } = useForm({
        role: user[0].role,
    });

    const { auth } = usePage().props;

    function handleUpdateRole(e) {
        e.preventDefault();
        put(
            route("roleuser.update", {
                id: user[0].id,
            }),
            {
                onSuccess: () => {
                    toast.success("Data berhasil diubah");
                },
                onError: () => {
                    toast.error("Data gagal diubah");
                },
            }
        );
    }

    function confirmResetPassword(userId) {
        toast(
            (t) => (
                <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-600 w-10 h-10" />
                        <p className="text-lg font-semibold text-red-600">
                            Apakah Anda yakin ingin me-reset password ini?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                handleResetPassword(userId);
                                toast.dismiss(t);
                            }}
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

    function handleResetPassword(userId) {
        post(`/admin/user-reset/password/${userId}`, {
            onSuccess: () => {
                toast.success("password berhasil di reset");
            },

            onError: () => {
                toast.error("gagal me reset password");
            },
        });
    }

    return (
        <>
            <AuthenticatedLayout
                header={<>Update User</>}
                children={
                    <>
                        <Head title="Update User" />
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <div className="max-w-5xl p-10">
                                <div className="p-6">
                                    <table className="table-auto w-full border-collapse">
                                        <tbody>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    ID Pegawai
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {user[0].id}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Nama
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {user[0].name}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Email
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    {user[0].email}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50 border-b">
                                                <th className="text-left px-6 py-4 font-medium text-gray-600">
                                                    Role
                                                </th>
                                                <td className="px-6 py-4 text-gray-800">
                                                    <select
                                                        className="rounded-lg"
                                                        name="role"
                                                        id="role"
                                                        value={data.role}
                                                        onChange={(e) =>
                                                            setData(
                                                                "role",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="admin">
                                                            Admin
                                                        </option>
                                                        <option value="operator">
                                                            Operator
                                                        </option>
                                                        <option value="superadmin">
                                                            Super Admin
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="mt-5 w-96">
                                        <button
                                            onClick={() =>
                                                confirmResetPassword(user[0].id)
                                            }
                                            className="bg-rose-600 text-white px-3 py-1 rounded"
                                        >
                                            Reset Password
                                        </button>
                                        {auth.user.role == "superadmin" ? (
                                            <button
                                                onClick={handleUpdateRole}
                                                disabled={processing}
                                                className="bg-green-500 text-white px-2 py-1 ml-5 rounded"
                                            >
                                                Simpan Perubahan
                                            </button>
                                        ) : (
                                            <span></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
