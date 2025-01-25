import React from "react";
import BottomNav from "@/Layouts/BottomNav";

export default function Izin({ successMessage, errorMessage }) {
    return (
        <div className="bg-gray-100 min-h-screen overflow-y-auto relative">
            {/* Header */}
            <div className="bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-white hover:text-gray-200"
                >
                    <ion-icon
                        name="chevron-back-outline"
                        className="text-2xl"
                    ></ion-icon>
                    <span className="ml-2 text-sm">Back</span>
                </button>
                <h1 className="text-lg font-semibold">Data Izin / Sakit</h1>
            </div>

            {/* Alert Section */}
            <div className="p-4">
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Berhasil!</strong>
                        <span className="block sm:inline">
                            {" "}
                            {successMessage}
                        </span>
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Gagal!</strong>
                        <span className="block sm:inline"> {errorMessage}</span>
                    </div>
                )}
            </div>

            {/* FAB Button */}
            <div className="fixed bottom-28 right-6 z-50">
                <a
                    href="/presensi/buatizin"
                    className="flex items-center justify-center w-16 h-16 bg-blue-950 text-white rounded-full shadow-xl hover:bg-blue-900 transition duration-200"
                >
                    <ion-icon
                        name="add-outline"
                        className="text-4xl"
                    ></ion-icon>
                </a>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
