import React, { useEffect, useRef, useState } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Script from "@/Layouts/Script";
import Webcam from "react-webcam";
import axios from "axios";
import Swal from "sweetalert2";

export default function Create({ cek }) {
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const lokasiInputRef = useRef(null);
    const webcamRef = useRef(null); // Reference untuk react-webcam
    const [isAbsenMasuk, setIsAbsenMasuk] = useState(cek === 0); // Tentukan default berdasarkan cek

    useEffect(() => {
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

                    L.circle(
                        [position.coords.latitude, position.coords.longitude],
                        {
                            color: "red",
                            fillColor: "#f03",
                            fillOpacity: 0.5,
                            radius: 100,
                        }
                    ).addTo(map);
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
                    timer: 3000,
                });
                return;
            }

            if (!location) {
                Swal.fire({
                    icon: "warning",
                    title: "Lokasi Tidak Tersedia",
                    text: "Ambil lokasi terlebih dahulu.",
                    showConfirmButton: false,
                    timer: 3000,
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
                        tipeAbsen: isAbsenMasuk ? "masuk" : "pulang", // Kirim tipe absen ke backend
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
                        didClose: () => {
                            // Redirect ke dashboard setelah selesai
                            window.location.href = "/dashboard";
                        },
                    });

                    if (isAbsenMasuk) setIsAbsenMasuk(false);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal!",
                        text: "Maaf, Gagal Absen. Silahkan Hubungi IT.",
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } catch (error) {
                console.error("Error submitting presensi:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Terjadi kesalahan saat mengirim data presensi.",
                    showConfirmButton: false,
                    timer: 3000,
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col pb-20">
            {isLoading && (
                <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}

            <div className="bg-blue-500 text-white flex items-center justify-between px-4 py-3 shadow-md">
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
                <h1 className="text-lg font-semibold">E-Presensi</h1>
            </div>

            <input type="hidden" id="lokasi" ref={lokasiInputRef} />

            <div className="flex flex-col items-center gap-4 mt-4 px-4">
                <div className="flex flex-col items-center justify-center mt-4">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="bg-gray-200 rounded-lg shadow-md"
                        style={{
                            width: "250px",
                            height: "250px",
                            borderRadius: "10px",
                        }}
                    />
                </div>

                <button
                    onClick={handleTakeAbsen}
                    className={`${
                        isAbsenMasuk
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-red-500 hover:bg-red-600"
                    } text-white rounded-lg px-6 py-3 flex items-center gap-2 transition duration-200 ease-in-out shadow-md w-full max-w-xs text-center`}
                >
                    <ion-icon
                        name="camera-outline"
                        className="text-lg"
                    ></ion-icon>
                    <span className="font-medium">
                        {isAbsenMasuk ? "Absen Masuk" : "Absen Pulang"}
                    </span>
                </button>

                {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <div className="w-full max-w-xs bg-gray-200 rounded-lg overflow-hidden shadow-md">
                    <div
                        id="map"
                        style={{ width: "100%", height: "150px" }}
                    ></div>
                </div>
            </div>

            <BottomNav />
            <Script />
        </div>
    );
}
