import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { CgHomeAlt } from "react-icons/cg";
import { ImDatabase } from "react-icons/im";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { IoIosSettings } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { TbMessageReport } from "react-icons/tb";

export default function AuthenticatedLayout({ header, children, izinSakit }) {
    const user = usePage().props.auth?.user || { name: "Guest" };

    const totalIzin = usePage().props.izinSakit?.izin.length || 0;
    const totalSakit = usePage().props.izinSakit?.sakit.length || 0;

    const [showDropdown, setShowDropdown] = useState(false);

    const totalPengajuanIzin = totalIzin + totalSakit;
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-56 bg-blue-950 sticky top-0 h-screen">
                <div className="h-16 flex items-center justify-center">
                    <Link href={route("dashboard")}>
                        <ApplicationLogo className="h-10 w-auto fill-current text-white" />
                    </Link>
                </div>
                <nav className="flex flex-col mt-10 space-y-2 px-2">
                    <NavLink
                        href={route("dashboard")}
                        className="block px-6 py-3 text-lg my-auto text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <CgHomeAlt className="mr-2 h-5 w-5" />
                        Home
                    </NavLink>
                    <NavLink
                        href={route("pegawai.index")}
                        className="block px-6 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <ImDatabase className=" mr-2" />
                        Pegawai
                    </NavLink>
                    <NavLink
                        href={route("pegawai.presensi")}
                        className="block px-5 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <HiOutlinePresentationChartLine className=" mr-2 w-6 h-6 " />
                        Monitoring Presensi
                    </NavLink>
                    <NavLink
                        href={route("izin.show")}
                        className="block px-5 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        <TbMessageReport className=" mr-2 w-6 h-6 " />
                        <div>
                            <p>Izin / Sakit</p>
                            {totalPengajuanIzin > 0 && (
                                <span className="text-red-500 text-sm">
                                    {totalPengajuanIzin} Pengajuan Baru
                                </span>
                            )}
                        </div>
                    </NavLink>
                    <NavLink
                        href={route("konfigurasi.index")}
                        className="block px-5 py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out whitespace-nowrap"
                    >
                        <IoIosSettings className=" mr-2 w-6 h-6 " />
                        Konfigurasi Jam Kerja
                    </NavLink>
                    {/* Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center px-6 py-3 text-white hover:bg-white hover:text-blue-950 rounded-lg transition-all duration-200 ease-in-out w-full"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <TbReportSearch className="text-2xl mr-1" />
                            Laporan
                            <RiArrowDropDownLine className="ml-10 text-2xl" />
                        </button>
                        <div
                            className={`absolute left-0 mt-2 ml-4 bg-blue-950 rounded-lg text-white z-10 transition-all duration-300 ease-in-out transform ${
                                showDropdown
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 -translate-y-5 pointer-events-none"
                            }`}
                        >
                            <NavLink
                                href={route("laporan.index")}
                                className="block px-5 w-full py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                            >
                                <IoIosSettings className="mr-2 w-6 h-6" />
                                Presensi
                            </NavLink>
                            <NavLink
                                href={route("laporan.rekap")}
                                className="block px-5 w-full py-3 text-lg text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                            >
                                <IoIosSettings className="mr-2 w-6 h-6" />
                                Rekap Presensi
                            </NavLink>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header (Informasi Akun dan Pengaturan) */}
                <header className="bg-white shadow-md sticky top-0 z-20">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        {header && (
                            <header className="text-2xl font-bold text-blue-950">
                                <h1>{header}</h1>
                            </header>
                        )}
                        <div className="flex items-center space-x-4">
                            {/* Dropdown Menu untuk User */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
                                        >
                                            {user.name}
                                            <RiArrowDropDownLine className="text-2xl" />
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Main Body Content */}
                <main className="p-6 flex-1 overflow-y-auto bg-gray-100">
                    <div>{children}</div>
                </main>
            </div>
        </div>
    );
}
