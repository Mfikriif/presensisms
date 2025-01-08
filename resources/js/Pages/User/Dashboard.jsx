import React, { useState, useEffect } from "react";
import BottomNav from "@/Layouts/BottomNav"; // Pastikan komponen BottomNav sudah dibuat
import Script from "@/Layouts/Script"; // Pastikan komponen Script sudah dibuat
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard() {
    const [user, setUser] = useState({});
    const [presensiHariIni, setPresensiHariIni] = useState({});
    const [rekapPresensi, setRekapPresensi] = useState({});
    const [historibulanini, setHistoribulanini] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Simulasi data
        setUser({
            namaLengkap: "John Doe",
            jabatan: "Staff",
            foto: null,
            cabang: "Cabang 1",
            departemen: "IT",
        });

        setPresensiHariIni({
            jamIn: "08:00",
            jamOut: null,
            fotoIn: null,
            fotoOut: null,
        });

        setRekapPresensi({
            hadir: 20,
            izin: 2,
            sakit: 1,
            cuti: 3,
        });

        setHistoribulanini([
            {
                status: "h",
                tgl_presensi: "2025-01-01",
                jam_masuk: "08:00",
                jam_pulang: "17:00",
                jam_in: "08:05",
                jam_out: "17:00",
                nama_jam_kerja: "Shift Pagi",
            },
            {
                status: "i",
                tgl_presensi: "2025-01-02",
                kode_izin: "IZIN1",
                keterangan: "Keperluan keluarga",
            },
            {
                status: "s",
                tgl_presensi: "2025-01-03",
                kode_izin: "SAKIT1",
                keterangan: "Demam",
            },
        ]);

        setLeaderboard([
            { namaLengkap: "Jane Doe", jabatan: "Manager", jam_in: "06:45" },
            { namaLengkap: "John Smith", jabatan: "Staff", jam_in: "08:10" },
        ]);
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
                            {user.namaLengkap}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {user.jabatan} ({user.cabang})
                        </p>
                        <p className="text-xs text-gray-400">
                            ({user.departemen})
                        </p>
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
            <div className="grid grid-cols-2 gap-4 p-4">
                {[
                    {
                        href: "/editprofile",
                        icon: "person-sharp",
                        label: "Profil",
                        color: "text-green-500",
                    },
                    {
                        href: "/presensi/izin",
                        icon: "calendar-number",
                        label: "Cuti",
                        color: "text-red-500",
                    },
                    {
                        href: "/presensi/histori",
                        icon: "document-text",
                        label: "Histori",
                        color: "text-yellow-500",
                    },
                    {
                        href: "/presensi/lokasi",
                        icon: "location",
                        label: "Lokasi",
                        color: "text-orange-500",
                    },
                ].map((menu, index) => (
                    <a
                        key={index}
                        href={menu.href}
                        className="flex flex-col items-center bg-white shadow rounded-lg p-4"
                    >
                        <ion-icon
                            name={menu.icon}
                            className={`${menu.color} text-3xl`}
                        ></ion-icon>
                        <p className="mt-2 text-sm font-medium">{menu.label}</p>
                    </a>
                ))}
            </div>

            {/* Rekap Presensi */}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                    Rekap Presensi Bulan Ini
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    {["Hadir", "Izin", "Sakit", "Cuti"].map((type, index) => (
                        <div
                            key={index}
                            className="bg-white shadow rounded-lg p-4 text-center"
                        >
                            <span className="block text-xl font-semibold text-gray-700">
                                {rekapPresensi[type.toLowerCase()] || 0}
                            </span>
                            <p className="text-sm text-gray-500">{type}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* History */}
            <div className="p-4">
                <h4 className="text-lg font-semibold mb-4">
                    History Bulan Ini
                </h4>
                {historibulanini.map((data, index) => (
                    <div
                        key={index}
                        className={`p-4 bg-white shadow rounded-lg mb-4 border-l-4 ${
                            data.status === "h"
                                ? "border-green-500"
                                : data.status === "i"
                                ? "border-yellow-500"
                                : "border-red-500"
                        }`}
                    >
                        <h5 className="text-sm font-medium">
                            {data.tgl_presensi}
                        </h5>
                        <p className="text-xs text-gray-500">
                            {data.keterangan || "Hadir"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Leaderboard */}
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
                                {user.namaLengkap}
                            </h5>
                            <p className="text-xs text-gray-500">
                                {user.jabatan}
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

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Scripts */}
            <Script />
        </div>
    );
}
