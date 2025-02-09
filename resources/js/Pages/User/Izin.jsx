import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import axios from "axios";
import {
    SwipeableList,
    SwipeableListItem,
    TrailingActions,
    LeadingActions,
    SwipeAction,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import toast, { Toaster } from "react-hot-toast";

export default function Izin({ dataizin, errorMessage, successMessage }) {
    const [izinList, setIzinList] = useState(dataizin);
    const [dibatalkan, setDibatalkan] = useState({});

    // Tampilkan error dan success message menggunakan react-hot-toast
    useEffect(() => {
        if (errorMessage) toast.error(errorMessage);
        if (successMessage) toast.success(successMessage);
    }, [errorMessage, successMessage]);

    const handleMarkForDelete = (id) => {
        setDibatalkan((prev) => ({ ...prev, [id]: true }));
    };

    const handleCancelIzin = async (id) => {
        try {
            const response = await axios.post(`/presensi/batalkanizin/${id}`);
            if (response.status === 200) {
                setIzinList((prevList) =>
                    prevList.filter((izin) => izin.id !== id)
                );
                setDibatalkan((prev) => {
                    const updatedDibatalkan = { ...prev };
                    delete updatedDibatalkan[id];
                    return updatedDibatalkan;
                });
                toast.success("Izin berhasil dibatalkan!");
            }
        } catch (error) {
            toast.error("Gagal membatalkan izin!");
        }
    };

    const handleRestoreIzin = (id) => {
        setDibatalkan((prev) => {
            const updatedDibatalkan = { ...prev };
            delete updatedDibatalkan[id];
            return updatedDibatalkan;
        });
    };

    const trailingActions = (id, statusApproved) => {
        if (statusApproved === "1" || statusApproved === "2") return null;
        return dibatalkan[id] ? (
            <TrailingActions threshold={0.9}>
                <SwipeAction
                    destructive={true}
                    onClick={() => handleCancelIzin(id)}
                >
                    <div className="bg-red-600 text-white flex items-center justify-center px-6 py-6 rounded-r-lg w-24 shadow-md">
                        <ion-icon
                            name="trash-outline"
                            className="text-3xl"
                        ></ion-icon>
                    </div>
                </SwipeAction>
            </TrailingActions>
        ) : (
            <TrailingActions threshold={0.5}>
                <SwipeAction onClick={() => handleMarkForDelete(id)}>
                    <div className="bg-yellow-500 text-white flex items-center justify-center px-6 py-6 rounded-r-lg w-40 shadow-md">
                        <span className="text-sm font-semibold">
                            Swipe Lagi Untuk Hapus
                        </span>
                    </div>
                </SwipeAction>
            </TrailingActions>
        );
    };

    const leadingActions = (id) =>
        dibatalkan[id] && (
            <LeadingActions threshold={0.5}>
                <SwipeAction onClick={() => handleRestoreIzin(id)}>
                    <div className="bg-blue-500 text-white flex items-center justify-center px-6 py-6 rounded-l-lg w-40 shadow-md">
                        <span className="text-sm font-semibold">
                            Batalkan Pembatalan
                        </span>
                    </div>
                </SwipeAction>
            </LeadingActions>
        );

    return (
        <MainLayout>
            <div className="bg-gray-50 h-screen flex flex-col relative">
                {/* Toaster untuk Notifikasi */}
                <Toaster position="top-center" reverseOrder={false} />

                {/* Header */}
                <div className="bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">
                    <button
                        onClick={() => (window.location.href = "/dashboardop")}
                        className="flex items-center text-white"
                    >
                        <ion-icon
                            name="chevron-back-outline"
                            className="text-2xl"
                        ></ion-icon>
                        <span className="ml-2 text-sm">Back</span>
                    </button>
                    <h1 className="text-lg font-semibold">Data Izin / Sakit</h1>
                </div>

                {/* Kontainer Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 pb-32">
                    {izinList.length > 0 ? (
                        <SwipeableList fullSwipe={false}>
                            {izinList.map((izin) => (
                                <SwipeableListItem
                                    key={izin.id}
                                    trailingActions={trailingActions(
                                        izin.id,
                                        izin.status_approved
                                    )}
                                    leadingActions={leadingActions(izin.id)}
                                >
                                    <li className="bg-white shadow-lg rounded-xl p-5 flex justify-between items-center w-full max-w-md mx-auto mb-3">
                                        <div className="flex flex-col w-full">
                                            <h3 className="text-base font-semibold text-gray-800">
                                                {new Date(
                                                    izin.tanggal_izin
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                <strong className="text-gray-700">
                                                    Jenis:
                                                </strong>{" "}
                                                {izin.status === "i"
                                                    ? "Izin"
                                                    : "Sakit"}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                <strong className="text-gray-700">
                                                    Keterangan:
                                                </strong>{" "}
                                                {izin.keterangan}
                                            </p>
                                        </div>

                                        {/* Status Persetujuan */}
                                        <span
                                            className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-md ${
                                                izin.status_approved === "0"
                                                    ? "bg-yellow-500 text-white"
                                                    : izin.status_approved ===
                                                      "1"
                                                    ? "bg-green-500 text-white"
                                                    : izin.status_approved ===
                                                      "batal"
                                                    ? "bg-gray-500 text-white"
                                                    : "bg-red-500 text-white"
                                            }`}
                                        >
                                            {izin.status_approved === "0"
                                                ? "Pending"
                                                : izin.status_approved === "1"
                                                ? "Disetujui"
                                                : izin.status_approved ===
                                                  "batal"
                                                ? "Dibatalkan"
                                                : "Ditolak"}
                                        </span>
                                    </li>
                                </SwipeableListItem>
                            ))}
                        </SwipeableList>
                    ) : (
                        <div className="flex justify-center items-center min-h-20 h-48">
                            <p className="text-gray-500 text-center text-base">
                                Belum ada data izin.
                            </p>
                        </div>
                    )}
                </div>

                {/* FAB Button (Mini) */}
                <div className="fixed bottom-28 right-6 z-50">
                    <a
                        href="/presensi/buatizin"
                        className="flex items-center justify-center w-12 h-12 bg-blue-950 text-white rounded-full shadow-lg hover:bg-blue-900 transition duration-200"
                    >
                        <ion-icon
                            name="add-outline"
                            className="text-2xl"
                        ></ion-icon>
                    </a>
                </div>
            </div>
        </MainLayout>
    );
}
