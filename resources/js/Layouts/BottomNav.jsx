import React from "react";
import { Link, usePage } from "@inertiajs/react";

const BottomNav = React.memo(() => {
    const { url } = usePage(); // Mengambil URL dari Inertia untuk menandai halaman aktif

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around items-center p-3 z-50">
            {/* Home */}
            <Link
                href="/dashboardop"
                className={`flex flex-col items-center ${
                    url.startsWith("/dashboardop")
                        ? "text-blue-950"
                        : "text-gray-500"
                }`}
            >
                <ion-icon name="home-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Home</strong>
            </Link>

            {/* Histori */}
            <Link
                href="/presensi/histori"
                className={`flex flex-col items-center ${
                    url.startsWith("/presensi/histori")
                        ? "text-blue-950"
                        : "text-gray-500"
                }`}
            >
                <ion-icon
                    name="document-text-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Histori</strong>
            </Link>

            {/* Camera */}
            <Link
                href="/presensi/create"
                className="flex justify-center items-center"
            >
                <div className="w-16 h-16 bg-blue-950 text-white rounded-full flex justify-center items-center shadow-lg">
                    <ion-icon name="camera" className="text-3xl"></ion-icon>
                </div>
            </Link>

            {/* Izin */}
            <Link
                href="/presensi/izin"
                className={`flex flex-col items-center ${
                    url.startsWith("/presensi/izin")
                        ? "text-blue-950"
                        : "text-gray-500"
                }`}
            >
                <ion-icon
                    name="calendar-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Izin</strong>
            </Link>

            {/* Profile */}
            <Link
                href="/editprofile"
                className={`flex flex-col items-center ${
                    url.startsWith("/editprofile")
                        ? "text-blue-950"
                        : "text-gray-500"
                }`}
            >
                <ion-icon name="people-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Profile</strong>
            </Link>
        </div>
    );
});

export default BottomNav;
