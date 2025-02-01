import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function Dashboard({
    rekapizin,
    presensihariini,
    historibulanini,
    namabulan,
    bulanini,
    rekapPresensi,
    leaderboard,
    user,
    shift,
}) {
    const [activeTab, setActiveTab] = useState("bulanIni");

    return (
        <MainLayout>
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
                                    Bandungrejo
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
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
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
                                    window.location.href = "/presensi/create"; // Arahkan ke halaman absen masuk
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
                                    <h4 className="text-sm font-bold">Masuk</h4>
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
                                        timer: 3000, // SweetAlert akan otomatis hilang dalam 3 detik
                                        timerProgressBar: true,
                                        showConfirmButton: false, // Tombol OK tidak ditampilkan
                                    });
                                } else {
                                    window.location.href = "/presensi/create"; // Arahkan ke halaman absen pulang jika sudah absen masuk
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
                                        count: rekapizin.jmlizin || 0,
                                    },
                                    {
                                        type: "Sakit",
                                        icon: "medkit-outline",
                                        color: "text-yellow-500",
                                        count: rekapizin.jmlsakit || 0,
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

                        <div className="p-4">
                            <h4 className="text-lg font-semibold mb-4 text-gray-700">
                                History Bulan Ini
                            </h4>

                            {historibulanini.length > 0 ? (
                                historibulanini.map((data, index) => {
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
                                                    : data.status === "i"
                                                    ? "border-yellow-500 bg-yellow-50"
                                                    : "border-red-500 bg-red-50"
                                            }`}
                                        >
                                            {/* Status Icon */}
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`w-9 h-9 flex items-center justify-center rounded-full text-md font-semibold ${
                                                        data.status === "h"
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
                                                    {data.keterangan || "Hadir"}
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
                                                                Belum Absen
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
                                                                Belum Absen
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
                {activeTab === "leaderboard" && (
                    <div className="p-4">
                        <h4 className="text-lg font-semibold mb-4">
                            Leaderboard
                        </h4>
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
            </div>
        </MainLayout>
    );
}
