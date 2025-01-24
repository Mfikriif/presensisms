import React from "react";

export default function BottomNav({ activePage }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around items-center p-3 z-50">
            {/* Home */}
            <a
                href="/dashboardop"
                className={`flex flex-col items-center ${
                    window.location.pathname === "/dashboardop"
                        ? "text-blue-950"
                        : "text-gray-500"
                } transition duration-200 ease-in-out hover:text-blue-950`}
            >
                <ion-icon name="home-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Home</strong>
            </a>

            {/* Histori */}
            <a
                href="/histori"
                className={`flex flex-col items-center ${
                    window.location.pathname === "/histori"
                        ? "text-blue-950"
                        : "text-gray-500"
                } transition duration-200 ease-in-out hover:text-blue-950`}
            >
                <ion-icon
                    name="document-text-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Histori</strong>
            </a>

            {/* Camera */}
            <a
                href="/presensi/create"
                className="flex justify-center items-center transition-transform duration-200 ease-in-out transform hover:scale-110"
            >
                <div className="w-16 h-16 bg-blue-950 text-white rounded-full flex justify-center items-center shadow-lg">
                    <ion-icon name="camera" className="text-3xl"></ion-icon>
                </div>
            </a>

            {/* Izin */}
            <a
                href="#"
                className={`flex flex-col items-center ${
                    activePage === "docs" ? "text-blue-950" : "text-gray-500"
                } transition duration-200 ease-in-out hover:text-blue-950`}
            >
                <ion-icon
                    name="calendar-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Izin</strong>
            </a>

            {/* Profile */}
            <a
                href="/editprofile"
                className={`flex flex-col items-center ${
                    activePage === "profile" ? "text-blue-950" : "text-gray-500"
                } transition duration-200 ease-in-out hover:text-blue-950`}
            >
                <ion-icon name="people-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Profile</strong>
            </a>
        </div>
    );
}
