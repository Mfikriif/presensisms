import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-950 shadow-lg">
                <div className="h-16 flex items-center justify-center">
                    <Link href={route("dashboard")}>
                        <ApplicationLogo className="h-10 w-auto fill-current text-white" />
                    </Link>
                </div>
                <nav className="flex flex-col mt-4 space-y-2 px-2">
                    <NavLink
                        href={route("dashboard")}
                        className="block px-6 py-3 text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        href={route("pegawai.index")}
                        className="block px-6 py-3 text-white hover:bg-white rounded-lg transition-all duration-200 ease-in-out"
                    >
                        Pegawai
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header (Informasi Akun dan Pengaturan) */}
                <header className="bg-white shadow-md">
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
                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
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
