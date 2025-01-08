import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <>
            <AuthenticatedLayout
                header={<h1> Dashboard Admin</h1>}
                children={
                    <>
                        <Head title="Dashboard Admin" />
                        <div className="max-w-screen-xl mx-auto">
                            <div className="flex flex-row justify-evenly">
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-fingerprint"
                                                className="w-8 h-8 bg-green-500 text-white rounded-md"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                />
                                                <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" />
                                                <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" />
                                                <path d="M12 11v2a14 14 0 0 0 2.5 8" />
                                                <path d="M8 15a18 18 0 0 0 1.8 6" />
                                                <path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>142</h2>
                                        <p>Karyawan Hadir</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-users"
                                                className="w-8 h-8 bg-blue-700 text-white rounded-md"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                />
                                                <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>142</h2>
                                        <p>Karyawan</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-file-text"
                                                className="w-8 h-8 bg-blue-500 text-white rounded-md"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                <path d="M9 9l1 0" />
                                                <path d="M9 13l6 0" />
                                                <path d="M9 17l6 0" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>142</h2>
                                        <p>Karyawan Izin</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-mood-sick"
                                                className="w-8 h-8 bg-orange-500 text-white rounded-md"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                />
                                                <path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z" />
                                                <path d="M9 10h-.01" />
                                                <path d="M15 10h-.01" />
                                                <path d="M8 16l1 -1l1.5 1l1.5 -1l1.5 1l1.5 -1l1 1" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>142</h2>
                                        <p>Karyawan Sakit</p>
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
