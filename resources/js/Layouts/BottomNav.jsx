import React from "react";

export default function BottomNav({ activePage }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-between items-center p-3">
            {/* Home */}
            <a
                href="/dashboardop"
                className={`flex flex-col items-center ${
                    window.location.pathname === "/dashboardop"
                        ? "text-red-500"
                        : "text-gray-500"
                }`}
            >
                <ion-icon name="home-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Home</strong>
            </a>

            {/* Histori */}
            <a
                href="/histori"
                className={`flex flex-col items-center ${
                    window.location.pathname === "/histori"
                        ? "text-red-500"
                        : "text-gray-500"
                }`}
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
                className="flex justify-center items-center"
            >
                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex justify-center items-center shadow-lg">
                    <ion-icon name="camera" className="text-2xl"></ion-icon>
                </div>
            </a>

            {/* Docs */}
            <a
                href="#"
                className={`flex flex-col items-center ${
                    activePage === "docs" ? "text-blue-500" : "text-gray-500"
                }`}
            >
                <ion-icon
                    name="document-text-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Docs</strong>
            </a>

            {/* Profile */}
            <a
                href="/editprofile"
                className={`flex flex-col items-center ${
                    activePage === "profile" ? "text-blue-500" : "text-gray-500"
                }`}
            >
                <ion-icon name="people-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Profile</strong>
            </a>
        </div>
    );
}
