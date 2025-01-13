import React, { useEffect, useState } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Script from "@/Layouts/Script";
import Webcam from "webcamjs";

export default function Create() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Initialize WebcamJS
        Webcam.set({
            width: 250,
            height: 250,
            image_format: "jpeg",
            jpeg_quality: 80,
        });

        Webcam.attach(".webcam-capture");

        // Get Geolocation
        const lokasi = document.getElementById("lokasi");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                successCallback,
                errorCallback
            );
        }

        function successCallback(position) {
            lokasi.value =
                position.coords.latitude + "," + position.coords.longitude;

            // Initialize map
            const map = L.map("map").setView(
                [position.coords.latitude, position.coords.longitude],
                18
            );

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            L.marker([
                position.coords.latitude,
                position.coords.longitude,
            ]).addTo(map);

            L.circle([position.coords.latitude, position.coords.longitude], {
                color: "red",
                fillColor: "#f03",
                fillOpacity: 0.5,
                radius: 100,
            }).addTo(map);
        }

        function errorCallback(error) {
            console.error("Error obtaining location:", error);
        }

        // $("#takeabsen").click(function(e)){
        //     Webcam.snap(function(uri){
        //         image = uri;
        //     });
        //     alert(image);
        // }
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col pb-20">
            {/* Loader */}
            {isLoading && (
                <div
                    id="loader"
                    className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50"
                >
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
            {/* End Loader */}

            {/* App Header */}
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
                <div></div>
            </div>

            {/* Input Lokasi */}
            <input type="hidden" id="lokasi" />

            {/* Main Content */}
            <div className="flex flex-col items-center gap-4 mt-4 px-4">
                {/* Webcam Capture */}
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
                        <div
                            className="webcam-capture"
                            style={{
                                width: "100px", // Lebar kecil
                                height: "100px", // Tinggi kecil
                                borderRadius: "10px", // Membulatkan sudut
                            }}
                        ></div>
                    </div>
                </div>
                {/* End Webcam Section */}

                {/* Button Section */}
                <button
                    id="takeabsen"
                    className="bg-blue-500 text-white rounded-lg px-6 py-3 flex items-center gap-2 hover:bg-blue-600 transition duration-200 ease-in-out shadow-md w-full max-w-xs text-center"
                >
                    <ion-icon
                        name="camera-outline"
                        className="text-lg"
                    ></ion-icon>
                    <span className="font-medium">Absen Masuk</span>
                </button>

                {/* Map Section */}
                <div className="w-full max-w-xs bg-gray-200 rounded-lg overflow-hidden shadow-md">
                    <div
                        id="map"
                        style={{
                            width: "100%",
                            height: "150px", // Ukuran map disesuaikan
                        }}
                    ></div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
            <Script />
        </div>
    );
}
