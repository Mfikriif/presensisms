import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import PullToRefresh from "react-pull-to-refresh";

export default function Dashboard({
    rekapizin,
    presensihariini,
    historibulanini,
    namabulan,
    bulanini,
    rekapPresensi,
    user,
    shift,
    jadwalMingguan,
}) {
    const [activeTab, setActiveTab] = useState("bulanIni");
    const handleRefresh = async () => {
        Inertia.reload();
    };
    const tabs = [
        { key: "bulanIni", label: "Bulan Ini" },
        { key: "jadwalKerja", label: "Jadwal Kerja" },
    ];

    return (
        <MainLayout>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="bg-gray-100 min-h-screen overflow-y-auto pb-24">
                    {/* User Section */}
                    <div className="bg-blue-950 shadow-md rounded-b-lg p-4 flex items-center justify-between overflow-hidden">
                        <div className="flex items-center">
                            {/* Avatar */}
                            <div className="rounded-full overflow-hidden w-16 h-16 border-4 border-blue-500">
                                <img
                                    src={
                                        user.foto
                                            ? `/storage/${user.foto}`
                                            : "/assets/img/sample/avatar/avatar1.jpg"
                                    }
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <div className="ml-4">
                                <h3 className="text-lg text-white font-semibold">
                                    {user.nama_lengkap}
                                </h3>
                                <p className="text-white text-sm mt-1">
                                    {user.posisi === "operator"
                                        ? "Operator"
                                        : user.posisi}{" "}
                                    -{" "}
                                    <span className="font-medium text-blue-300">
                                        44.595.18
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <a
                            href="#"
                            className="text-red-400 hover:text-red-500 transition duration-300"
                            onClick={(e) => {
                                e.preventDefault();
                                Inertia.post(route("logout"));
                            }}
                        >
                            <ion-icon
                                name="exit-outline"
                                className="text-3xl"
                            ></ion-icon>
                        </a>
                    </div>
                    {/* Absensi Hari Ini */}
                    <div className="relative w-full overflow-hidden">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('/assets/img/bringin.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                width: "100%",
                                height: "100%",
                            }}
                        ></div>

                        {/* Overlay agar teks lebih jelas */}
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                        {/* Konten */}
                        <div className="relative z-10 p-4">
                            <h3 className="text-lg font-semibold mb-4 text-white">
                                Presensi Hari Ini
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Masuk Card */}
                                <div
                                    className={`rounded-lg shadow-lg p-4 flex items-center justify-between transition duration-300 ${
                                        presensihariini?.jam_in
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-400 to-green-500 text-white"
                                    }`}
                                    onClick={() => {
                                        if (!presensihariini?.jam_in) {
                                            window.location.href =
                                                "/presensi/create";
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {presensihariini?.foto_in ? (
                                                <img
                                                    src={`/storage/uploads/absensi/${presensihariini.foto_in}`}
                                                    alt="Absen Masuk"
                                                    className="w-12 h-12 rounded-full border-2 border-white"
                                                />
                                            ) : (
                                                <ion-icon
                                                    name="camera-outline"
                                                    className="text-4xl text-white"
                                                ></ion-icon>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-bold">
                                                Masuk
                                            </h4>
                                            <span className="text-xs">
                                                {presensihariini?.jam_in ||
                                                    "Klik untuk Absen"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pulang Card */}
                                <div
                                    className={`rounded-lg shadow-lg p-4 flex items-center justify-between transition duration-300 ${
                                        presensihariini?.jam_out
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-red-400 to-red-500 text-white"
                                    }`}
                                    onClick={() => {
                                        if (!presensihariini?.jam_in) {
                                            Swal.fire({
                                                title: "Oops!",
                                                text: "Belum melakukan absen masuk",
                                                icon: "warning",
                                                timer: 3000,
                                                timerProgressBar: true,
                                                showConfirmButton: false,
                                            });
                                        } else {
                                            window.location.href =
                                                "/presensi/create";
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {presensihariini?.foto_out ? (
                                                <img
                                                    src={`/storage/uploads/absensi/${presensihariini.foto_out}`}
                                                    alt="Absen Pulang"
                                                    className="w-12 h-12 rounded-full border-2 border-white"
                                                />
                                            ) : (
                                                <ion-icon
                                                    name="camera-outline"
                                                    className="text-4xl text-white"
                                                ></ion-icon>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-bold">
                                                Pulang
                                            </h4>
                                            <span className="text-xs">
                                                {presensihariini?.jam_out ||
                                                    "Klik untuk Absen"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex justify-between border-b bg-white">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`flex-1 px-4 py-2 text-center font-semibold ${
                                    activeTab === tab.key
                                        ? "text-blue-500 border-b-2 border-blue-500"
                                        : "text-gray-500"
                                }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === "bulanIni" && (
                        <div>
                            {/* Rekap Presensi */}
                            <div className="p-4" id="rekappresensi">
                                <h3 className="text-lg font-semibold mb-4 text-center">
                                    Rekap Presensi Bulan {namabulan[bulanini]}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
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
                                            count: rekapizin.jmlizin || 0,
                                        },
                                        {
                                            type: "Sakit",
                                            icon: "medkit-outline",
                                            color: "text-yellow-500",
                                            count: rekapizin.jmlsakit || 0,
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="relative bg-white shadow rounded-lg p-3 flex flex-col items-center"
                                        >
                                            {/* Badge */}
                                            <span
                                                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full text-xs px-2 py-0.5"
                                                style={{ fontSize: "0.7rem" }}
                                            >
                                                {item.count}
                                            </span>

                                            {/* Icon */}
                                            <ion-icon
                                                name={item.icon}
                                                className={`${item.color} text-3xl mb-2`}
                                            ></ion-icon>

                                            {/* Label */}
                                            <span className="text-sm font-medium text-gray-700">
                                                {item.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-4">
                                    History Bulan Ini
                                </h3>

                                {historibulanini.length > 0 ? (
                                    historibulanini
                                        .sort(
                                            (a, b) =>
                                                new Date(a.tanggal_presensi) -
                                                new Date(b.tanggal_presensi)
                                        ) // 🔥 Urutkan ASC berdasarkan tanggal
                                        .map((data, index) => {
                                            // Menentukan apakah terlambat berdasarkan jam kerja
                                            const terlambat =
                                                data.jam_in &&
                                                shift &&
                                                data.jam_in > shift.jam_masuk;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-3 rounded-lg shadow-md mb-3 flex items-start gap-3 border-l-8 transition duration-300 hover:shadow-lg ${
                                                        data.status === "h"
                                                            ? "border-green-500 bg-green-50"
                                                            : data.status ===
                                                              "i"
                                                            ? "border-yellow-500 bg-yellow-50"
                                                            : "border-red-500 bg-red-50"
                                                    }`}
                                                >
                                                    {/* Status Icon */}
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className={`w-9 h-9 flex items-center justify-center rounded-full text-md font-semibold ${
                                                                data.status ===
                                                                "h"
                                                                    ? "bg-green-500 text-white"
                                                                    : data.status ===
                                                                      "i"
                                                                    ? "bg-yellow-500 text-white"
                                                                    : "bg-red-500 text-white"
                                                            }`}
                                                        >
                                                            {data.status.toUpperCase()}
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-grow">
                                                        <h5 className="text-sm font-semibold text-gray-800">
                                                            {new Date(
                                                                data.tanggal_presensi
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </h5>
                                                        <p className="text-xs text-gray-600 mb-1">
                                                            {data.keterangan ||
                                                                "Hadir"}
                                                        </p>

                                                        {/* Jam Masuk */}
                                                        <div className="text-xs flex items-center">
                                                            <span className="text-green-700 font-semibold mr-1">
                                                                Jam Masuk:
                                                            </span>
                                                            <span
                                                                className={`text-gray-700 ${
                                                                    terlambat
                                                                        ? "text-red-500 font-semibold"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {data.jam_in || (
                                                                    <span className="italic text-gray-500">
                                                                        Belum
                                                                        Absen
                                                                    </span>
                                                                )}
                                                            </span>
                                                            {terlambat && (
                                                                <span className="ml-1 text-[9px] font-semibold bg-red-500 text-white px-1 rounded">
                                                                    Terlambat
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Jam Pulang */}
                                                        <p className="text-xs flex items-center mt-1">
                                                            <strong className="text-red-700 mr-1">
                                                                Jam Pulang:
                                                            </strong>{" "}
                                                            <span className="text-gray-700">
                                                                {data.jam_out || (
                                                                    <span className="italic text-gray-500">
                                                                        Belum
                                                                        Absen
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    // Jika Tidak Ada Data
                                    <div className="text-center py-4">
                                        <p className="text-gray-500 text-sm">
                                            Belum ada data absensi bulan ini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Jadwal Kerja */}
                    {activeTab === "jadwalKerja" && (
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4 text-center">
                                Jadwal Kerja Mingguan
                            </h3>

                            {jadwalMingguan.length > 0 ? (
                                <div className="bg-white p-4 shadow rounded-lg">
                                    {jadwalMingguan.map((jadwal, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between py-2 border-b last:border-none"
                                        >
                                            <span className="font-medium text-gray-700">
                                                {jadwal.hari}
                                            </span>
                                            <span className="text-gray-500">
                                                {jadwal.jam_masuk} -{" "}
                                                {jadwal.jam_pulang}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Tambahkan informasi terakhir diperbarui */}
                                    <div className="text-right text-xs text-gray-500 mt-4">
                                        Terakhir diperbarui:{" "}
                                        {new Date(
                                            jadwalMingguan[0].updated_at
                                        ).toLocaleString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 text-sm">
                                        Belum ada jadwal kerja yang tersedia.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </PullToRefresh>
        </MainLayout>
    );
}
