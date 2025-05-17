import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import "../../../css/app.css";
import { Head } from "@inertiajs/react";

export default function Dashboard({
    rekapizin,
    presensihariini,
    historibulanini,
    namabulan,
    bulanini,
    rekapPresensi,
    user,
    shift,
    shiftKerjaTerisi,
    shiftKerja,
}) {
    // Fungsi untuk mendapatkan minggu ke-berapa dalam bulan
    const getCurrentWeekOfMonth = () => {
        const today = new Date(); // Tanggal hari ini
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Tanggal 1 di bulan ini

        // Hitung perbedaan hari dari awal bulan ke hari ini
        const dayOfMonth = today.getDate();
        const startDay = startOfMonth.getDay(); // 0 = Minggu, 1 = Senin, dst.

        // Menghitung minggu dengan asumsi Senin sebagai awal minggu
        const weekNumber = Math.ceil((dayOfMonth + startDay) / 7);

        return `Minggu ke-${weekNumber}`;
    };

    // State untuk menyimpan minggu saat ini
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeekOfMonth());

    useEffect(() => {
        setCurrentWeek(getCurrentWeekOfMonth()); // Perbarui state saat komponen dimuat
    }, []);

    const [activeTab, setActiveTab] = useState("bulanIni");
    const tabs = [
        { key: "bulanIni", label: "Bulan Ini" },
        { key: "shiftKerja", label: "Shift Kerja" },
    ];

    const [shiftData, setShiftData] = useState({
        senin: "",
        selasa: "",
        rabu: "",
        kamis: "",
        jumat: "",
        sabtu: "",
        minggu: "",
    });

    // Mengisi form dengan data shift dari database
    useEffect(() => {
        if (shiftKerjaTerisi) {
            const mappedShift = {};
            shiftKerjaTerisi.forEach((shift) => {
                mappedShift[shift.hari.toLowerCase()] = shift.kode_jamkerja;
            });
            setShiftData(mappedShift);
        }
    }, [shiftKerjaTerisi]);

    // Fungsi untuk menyimpan shift otomatis dengan debounce
    const saveShift = debounce((updatedShiftData) => {
        Inertia.post(
            route("dashboard.setShiftKerja"), // Endpoint untuk menyimpan data shift
            {
                id: user.id,
                nama: user.nama_lengkap,
                shift: updatedShiftData,
            },
            {
                preserveScroll: true, // Mencegah reload atau scroll ke atas
                onSuccess: () => {
                    toast.success("Shift berhasil disimpan!", {
                        duration: 3000,
                    });
                },
                onError: (error) => {
                    console.error("Gagal menyimpan shift:", error);
                    toast.error(
                        "Terjadi kesalahan saat menyimpan shift kerja. Silakan coba lagi.",
                        {
                            duration: 5000,
                        }
                    );
                },
            }
        );
    }, 300);

    // Fungsi untuk menangani perubahan shift
    const handleChange = (day, value) => {
        const updatedShiftData = { ...shiftData, [day]: value };
        setShiftData(updatedShiftData);

        // Menampilkan SweetAlert
        Swal.fire({
            title: "Shift Diperbarui",
            text: `Shift untuk hari ${
                day.charAt(0).toUpperCase() + day.slice(1)
            } telah diubah.`,
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: "custom-swal-popup",
                title: "custom-swal-title",
                content: "custom-swal-content",
            },
        }).then(() => {
            // Simpan shift setelah SweetAlert ditutup
            saveShift(updatedShiftData);
        });
    };

    const rekapItems = [
        {
            type: "Hadir",
            iconName: "checkmark-done-outline",
            iconColor: "text-blue-500",
            count: rekapPresensi.hadir || 0,
        },
        {
            type: "Izin",
            iconName: "document-outline",
            iconColor: "text-green-500",
            count: rekapizin.jmlizin || 0,
        },
        {
            type: "Sakit",
            iconName: "medkit-outline",
            iconColor: "text-yellow-500",
            count: rekapizin.jmlsakit || 0,
        },
    ];

    function Clock() {
        const [currentTime, setCurrentTime] = useState(new Date());

        useEffect(() => {
            const timer = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);

            // Cleanup interval saat komponen di-unmount
            return () => clearInterval(timer);
        }, []);

        const formattedTime = new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Jakarta",
        }).format(currentTime);

        const formattedDate = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(currentTime);

        return (
            <div className="text-white text-center mb-6">
                <div className="text-4xl font-extrabold">{formattedTime}</div>
                <div className="text-lg mt-1">{formattedDate}</div>
            </div>
        );
    }

    return (
        <MainLayout>
            <Head title="Dasbor | E-Presensi SMS" />
            <div className="bg-gray-100 min-h-screen overflow-y-auto pb-24">
                {/* User Section */}
                <div className="bg-blue-950 shadow-md rounded-b-sm p-4 flex items-center justify-between overflow-hidden">
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
                                    : user.posisi === "staff"
                                    ? "Staff"
                                    : user.posisi === "security"
                                    ? "Security"
                                    : user.posisi === "cleaning service"
                                    ? "Cleaning Service"
                                    : "Jabatan Tidak Diketahui"}{" "}
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
                        className="flex items-center justify-center bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 active:bg-red-700 transition duration-300 w-12 h-12"
                        onClick={(e) => {
                            e.preventDefault();

                            Swal.fire({
                                title: "Konfirmasi Logout",
                                text: "Apakah Anda yakin ingin logout?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Ya, Logout",
                                cancelButtonText: "Batal",
                                customClass: {
                                    popup: "custom-swal-popup",
                                    title: "custom-swal-title",
                                    content: "custom-swal-content",
                                    confirmButton: "custom-swal-confirm",
                                    cancelButton: "custom-swal-cancel",
                                },
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Inertia.post(route("logout"));
                                }
                            });
                        }}
                    >
                        <ion-icon name="exit" className="text-xl"></ion-icon>
                    </a>
                </div>

                {/* Absensi Hari Ini */}
                <div className="relative w-full overflow-hidden pb-8">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/assets/img/operator.jpeg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center 70%",
                            width: "100%",
                            height: "100%",
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black bg-opacity-35"></div>

                    {/* Konten */}
                    <div className="relative z-10 px-6 py-10 max-w-xl mx-auto">
                        <Clock />
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
                        <div>
                            {/* Rekap Presensi */}
                            <div className="p-4" id="rekappresensi">
                                <h3 className="text-lg font-semibold mb-4 text-center">
                                    Rekap Presensi Bulan {namabulan[bulanini]}
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {rekapItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="relative bg-white shadow rounded-lg p-3 flex flex-col items-center justify-center"
                                        >
                                            {/* Custom Badge */}
                                            {item.count > 0 && (
                                                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs font-bold px-2 py-0.5 shadow-lg">
                                                    {item.count}
                                                </span>
                                            )}

                                            {/* Icon */}
                                            <ion-icon
                                                name={item.iconName}
                                                className={`${item.iconColor} text-4xl mb-2`}
                                            ></ion-icon>

                                            {/* Label */}
                                            <span className="text-sm font-medium text-gray-700 mt-2">
                                                {item.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4">
                                Histori Bulan Ini
                            </h3>

                            {historibulanini.length > 0 ? (
                                historibulanini
                                    .sort(
                                        (a, b) =>
                                            new Date(a.tanggal_presensi) -
                                            new Date(b.tanggal_presensi)
                                    )
                                    .map((data, index) => {
                                        const terlambat = (() => {
                                            // Validasi data jam_in dan shift
                                            if (
                                                !data.jam_in ||
                                                !shift ||
                                                !shift.jam_masuk
                                            ) {
                                                return null;
                                            }

                                            // Format waktu dengan tanggal default
                                            const jamIn = new Date(
                                                `1970-01-01T${data.jam_in}`
                                            );
                                            const jamMasuk = new Date(
                                                `1970-01-01T${shift.jam_masuk}`
                                            );

                                            // Validasi apakah waktu valid
                                            if (
                                                isNaN(jamIn.getTime()) ||
                                                isNaN(jamMasuk.getTime())
                                            ) {
                                                return null;
                                            }

                                            // Perbandingan waktu
                                            return jamIn > jamMasuk;
                                        })();

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
                                                                weekday: "long", // Tambahkan ini untuk menampilkan nama hari
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

                {/* Shift Kerja */}
                {activeTab === "shiftKerja" && (
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
                            Shift Kerja {currentWeek}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                "senin",
                                "selasa",
                                "rabu",
                                "kamis",
                                "jumat",
                                "sabtu",
                                "minggu",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200 active:shadow-sm active:scale-95 transition"
                                >
                                    {/* Nama Hari */}
                                    <h4 className="text-gray-700 font-semibold capitalize mb-2">
                                        {day}
                                    </h4>

                                    {/* Dropdown */}
                                    <select
                                        name={day}
                                        value={shiftData[day] || ""}
                                        onChange={(e) =>
                                            handleChange(day, e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-blue-400 focus:border-blue-500 transition"
                                    >
                                        <option value="">
                                            Pilih Shift Kerja
                                        </option>
                                        {shiftKerja
                                            .sort((a, b) =>
                                                a.nama_jamkerja.localeCompare(
                                                    b.nama_jamkerja
                                                )
                                            ) // Mengurutkan berdasarkan nama shift
                                            .map((shift) => (
                                                <option
                                                    key={shift.kode_jamkerja}
                                                    value={shift.kode_jamkerja}
                                                >
                                                    {`${shift.nama_jamkerja} (${shift.awal_jam_masuk} - ${shift.jam_pulang})`}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
