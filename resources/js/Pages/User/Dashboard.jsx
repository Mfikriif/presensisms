import React, { useState, useEffect } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Script from "@/Layouts/Script";
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard({
    presensihariini,
    historibulanini,
    namabulan,
    bulanini,
    rekapPresensi,
    leaderboard,
    user,
}) {
    const [activeTab, setActiveTab] = useState("bulanIni");
    // const [user, setUser] = useState({});

    useEffect(() => {
        // Simulasi data
        // setUser({
        //     namaLengkap: "John Doe",
        //     jabatan: "Staff",
        //     foto: null,
        //     cabang: "Cabang 1",
        //     departemen: "IT",
        // });
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen overflow-y-auto pb-16">
            {/* User Section */}
            <div className="bg-white shadow p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="rounded-full overflow-hidden w-16 h-16">
                        <img
                            src={
                                user.foto ||
                                "/assets/img/sample/avatar/avatar1.jpg"
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold">
                            {user.nama_lengkap}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {user.posisi} {user.cabang}
                        </p>
                        {/* <p className="text-xs text-gray-400">
                            ({user.departemen})
                        </p> */}
                    </div>
                </div>
                <a
                    href="#"
                    className="text-red-500 text-xl"
                    onClick={(e) => {
                        e.preventDefault();
                        Inertia.post(route("logout"));
                    }}
                >
                    <ion-icon name="exit-outline"></ion-icon>
                </a>
            </div>
            {/* Menu Section */}
            <div className="grid grid-cols-2 gap-3 p-4">
                {[
                    {
                        href: "/editprofile",
                        icon: "person-sharp",
                        label: "Profil",
                    },
                    {
                        href: "/presensi/izin",
                        icon: "calendar-number",
                        label: "Cuti",
                    },
                    {
                        href: "/presensi/histori",
                        icon: "document-text",
                        label: "Histori",
                    },
                    {
                        href: "/presensi/lokasi",
                        icon: "location",
                        label: "Lokasi",
                    },
                ].map((menu, index) => (
                    <a
                        key={index}
                        href={menu.href}
                        className="flex flex-col items-center justify-center bg-white shadow-sm rounded-lg p-2 transform hover:scale-105 transition-transform"
                    >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                            <ion-icon
                                name={menu.icon}
                                className="text-gray-500 text-xl"
                            ></ion-icon>
                        </div>
                        <p className="mt-1 text-xs font-medium text-gray-700">
                            {menu.label}
                        </p>
                    </a>
                ))}
            </div>
            {/* Today Presence Section */}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                    Presensi Hari Ini
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* Masuk Card */}
                    <div className="bg-green-500 text-white rounded-lg shadow-lg p-4 flex items-center">
                        <div className="flex-shrink-0">
                            {presensihariini?.foto_in ? (
                                <img
                                    src={`/storage/uploads/absensi/${presensihariini.foto_in}`}
                                    alt="Absen Masuk"
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <ion-icon
                                    name="camera-outline"
                                    className="text-4xl"
                                ></ion-icon>
                            )}
                        </div>
                        <div className="ml-4">
                            <h4 className="text-sm font-medium">Masuk</h4>
                            <span className="text-xs">
                                {presensihariini?.jam_in || "Belum Absen"}
                            </span>
                        </div>
                    </div>

                    {/* Pulang Card */}
                    <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-center">
                        <div className="flex-shrink-0">
                            {presensihariini?.foto_out ? (
                                <img
                                    src={`/storage/uploads/absensi/${presensihariini.foto_out}`}
                                    alt="Absen Pulang"
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <ion-icon
                                    name="camera-outline"
                                    className="text-4xl"
                                ></ion-icon>
                            )}
                        </div>
                        <div className="ml-4">
                            <h4 className="text-sm font-medium">Pulang</h4>
                            <span className="text-xs">
                                {presensihariini?.jam_out || "Belum Absen"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tabs Navigation */}
            <div className="flex justify-center border-b bg-white">
                <button
                    className={`px-4 py-2 w-1/2 text-center font-semibold ${
                        activeTab === "bulanIni"
                            ? "text-blue-500 border-b-2 border-blue-500"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("bulanIni")}
                >
                    Bulan Ini
                </button>
                <button
                    className={`px-4 py-2 w-1/2 text-center font-semibold ${
                        activeTab === "leaderboard"
                            ? "text-blue-500 border-b-2 border-blue-500"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("leaderboard")}
                >
                    Leaderboard
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "bulanIni" && (
                <div>
                    {/* Rekap Presensi */}
                    <div className="p-4" id="rekappresensi">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Rekap Presensi Bulan {namabulan[bulanini]}
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                {
                                    type: "Hadir",
                                    icon: "accessibility-outline",
                                    color: "text-blue-500",
                                    count: rekapPresensi.hadir || 0,
                                },
                                {
                                    type: "Izin",
                                    icon: "newspaper-outline",
                                    color: "text-green-500",
                                    count: rekapPresensi.izin || 0,
                                },
                                {
                                    type: "Sakit",
                                    icon: "medkit-outline",
                                    color: "text-yellow-500",
                                    count: rekapPresensi.sakit || 0,
                                },
                                {
                                    type: "Cuti",
                                    icon: "document-outline",
                                    color: "text-red-500",
                                    count: rekapPresensi.cuti || 0,
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center"
                                >
                                    {/* Badge */}
                                    <span
                                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full text-xs px-2 py-0.5"
                                        style={{
                                            fontSize: "0.7rem",
                                            zIndex: 1,
                                        }}
                                    >
                                        {item.count}
                                    </span>
                                    {/* Icon */}
                                    <ion-icon
                                        name={item.icon}
                                        className={`${item.color} text-4xl mb-2`}
                                    ></ion-icon>
                                    {/* Label */}
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History */}
                    <div className="p-4">
                        <h4 className="text-lg font-semibold mb-4 text-gray-700">
                            History Bulan Ini
                        </h4>
                        {historibulanini.map((data, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg shadow-lg mb-4 flex items-start gap-4 border-l-8 ${
                                    data.status === "h"
                                        ? "border-green-500 bg-green-50"
                                        : data.status === "i"
                                        ? "border-yellow-500 bg-yellow-50"
                                        : "border-red-500 bg-red-50"
                                }`}
                            >
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold ${
                                            data.status === "h"
                                                ? "bg-green-500 text-white"
                                                : data.status === "i"
                                                ? "bg-yellow-500 text-white"
                                                : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {data.status === "h"
                                            ? "H"
                                            : data.status === "i"
                                            ? "I"
                                            : "S"}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h5 className="text-sm font-semibold text-gray-800">
                                        {data.Tanggal_presensi}
                                    </h5>
                                    <p className="text-xs text-gray-600 mb-2">
                                        {data.keterangan || "Hadir"}
                                    </p>
                                    <p className="text-xs">
                                        <strong className="text-green-700">
                                            Jam Masuk:
                                        </strong>{" "}
                                        {data.jam_in || (
                                            <span className="italic text-gray-500">
                                                Belum Absen
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs">
                                        <strong className="text-red-700">
                                            Jam Pulang:
                                        </strong>{" "}
                                        {data.jam_out || (
                                            <span className="italic text-gray-500">
                                                Belum Absen
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "leaderboard" && (
                <div className="p-4">
                    <h4 className="text-lg font-semibold mb-4">Leaderboard</h4>
                    {leaderboard.map((user, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-white shadow rounded-lg p-4 mb-4"
                        >
                            <img
                                src="/assets/img/sample/avatar/avatar1.jpg"
                                alt="avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="ml-4">
                                <h5 className="text-sm font-medium">
                                    {user.nama_lengkap}
                                </h5>
                                <p className="text-xs text-gray-500">
                                    {user.posisi}
                                </p>
                                <span
                                    className={`text-xs font-semibold ${
                                        user.jam_in < "07:00"
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {user.jam_in}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNav />
            {/* Scripts */}
            <Script />
        </div>
    );
}
