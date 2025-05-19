import React, { useEffect, useRef, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Webcam from "react-webcam";
import axios from "axios";
import Swal from "sweetalert2";
import { Head } from "@inertiajs/react";

export default function Create({ cek }) {
    const [isLoading, setIsLoading] = useState(false);
    const [setWebcamReady] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const lokasiInputRef = useRef(null);
    const webcamRef = useRef(null);
    const [isAbsenMasuk, setIsAbsenMasuk] = useState(cek === 0);

    useEffect(() => {
        // Cek apakah Webcam sudah siap
        setTimeout(() => {
            setWebcamReady(true);
        }, 3000);

        // Dapatkan Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = `${position.coords.latitude},${position.coords.longitude}`;
                    setLocation(coords);
                    if (lokasiInputRef.current) {
                        lokasiInputRef.current.value = coords;
                    }

                    // Initialize Map
                    const map = L.map("map").setView(
                        [position.coords.latitude, position.coords.longitude],
                        18
                    );

                    L.tileLayer(
                        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                            maxZoom: 19,
                            attribution:
                                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        }
                    ).addTo(map);

                    L.marker([
                        position.coords.latitude,
                        position.coords.longitude,
                    ]).addTo(map);

                    // Lokasi Kantor -7.023826563310556, 110.50695887209068
                    L.circle([-7.023826563310556, 110.50695887209068], {
                        color: "red",
                        fillColor: "#f03",
                        fillOpacity: 0.5,
                        radius: 20,
                    }).addTo(map);
                },
                (error) => {
                    console.error("Error obtaining location:", error);
                    setErrorMessage(
                        "Gagal mendapatkan lokasi. Periksa izin lokasi Anda."
                    );
                }
            );
        } else {
            setErrorMessage("Browser tidak mendukung geolocation.");
        }
    }, []);

    const handleTakeAbsen = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Gagal menangkap gambar. Coba lagi.",
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 3000,
                    customClass: {
                        popup: "custom-swal-popup",
                        title: "custom-swal-title",
                        content: "custom-swal-content",
                    },
                });
                return;
            }

            if (!location) {
                Swal.fire({
                    icon: "warning",
                    title: "Lokasi Tidak Tersedia",
                    text: "Ambil lokasi terlebih dahulu.",
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 3000,
                    customClass: {
                        popup: "custom-swal-popup",
                        title: "custom-swal-title",
                        content: "custom-swal-content",
                    },
                });
                return;
            }

            setIsLoading(true);

            try {
                const response = await axios.post(
                    "/presensi/store",
                    {
                        image: imageSrc,
                        lokasi: location,
                        tipeAbsen: isAbsenMasuk ? "masuk" : "pulang",
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": document
                                .querySelector('meta[name="csrf-token"]')
                                .getAttribute("content"),
                        },
                    }
                );

                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil!",
                        text: isAbsenMasuk
                            ? "Terima kasih, Selamat Bekerja!"
                            : "Terima kasih, Hati-Hati di Jalan!",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        customClass: {
                            popup: "custom-swal-popup",
                            title: "custom-swal-title",
                            content: "custom-swal-content",
                        },
                        didClose: () => {
                            window.location.href = "/dashboardop";
                        },
                    });

                    if (isAbsenMasuk) setIsAbsenMasuk(false);
                }
            } catch (error) {
                if (error.response) {
                    const errorMessage =
                        error.response.data.message ||
                        "Terjadi kesalahan saat absen.";

                    Swal.fire({
                        icon: "error",
                        title: "Gagal!",
                        text: errorMessage,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        timer: 3000,
                        customClass: {
                            popup: "custom-swal-popup",
                            title: "custom-swal-title",
                            content: "custom-swal-content",
                        },
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <MainLayout>
            <Head title="Absen | E-Presensi SMS" />
            <div className="bg-gray-100 min-h-screen flex flex-col pb-20 relative pt-16">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-white hover:text-gray-200"
                    >
                        <ion-icon
                            name="chevron-back-outline"
                            className="text-2xl"
                        ></ion-icon>
                        <span className="ml-2 text-sm">Kembali</span>
                    </button>
                    <h1 className="text-lg font-semibold">E-Presensi</h1>
                </div>

                {/* Form Section */}
                <div className="flex-grow flex flex-col items-center gap-6 mt-6 px-4">
                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md w-full max-w-xs">
                            <p className="text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* Webcam Section */}
                    <div className="flex flex-col items-center justify-center">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="rounded-lg shadow-lg border-2 border-gray-350"
                            style={{
                                width: "250px",
                                height: "250px",
                                transform: "scaleX(-1)",
                            }}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Pastikan wajah Anda terlihat jelas.
                        </p>
                    </div>

                    {/* Absen Button */}
                    <button
                        onClick={handleTakeAbsen}
                        className={`${
                            isAbsenMasuk
                                ? "bg-gradient-to-r from-blue-800 to-blue-950 hover:from-blue-800 hover:to-blue-950"
                                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        } text-white rounded-full px-8 py-4 flex items-center gap-2 transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none`}
                    >
                        <ion-icon
                            name="camera-outline"
                            className="text-2xl"
                        ></ion-icon>
                        <span className="font-semibold text-lg">
                            {isAbsenMasuk ? "Absen Masuk" : "Absen Pulang"}
                        </span>
                    </button>

                    {/* Map Section */}
                    <div className="w-full max-w-xs bg-white rounded-lg overflow-hidden shadow-lg">
                        <div
                            id="map"
                            className="bg-gray-100 relative z-0"
                            style={{
                                width: "100%",
                                height: "200px",
                                borderRadius: "10px",
                            }}
                        ></div>
                        <p className="text-xs text-gray-500 text-center py-2">
                            Lokasi Anda saat ini.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
