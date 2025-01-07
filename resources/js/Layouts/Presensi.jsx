import React from "react";
import BottomNav from "./BottomNav";
import Script from "./Script";

export default function Presensi() {
    const activePage = "presensi/histori"; // Active page indicator
    const isKaryawan = true; // Replace with actual logic
    const statusJamKerja = 1; // Replace with actual logic

    return (
        <div style={{ backgroundColor: "#e9ecef" }}>
            {/* Header Section */}
            <header>
                <h1>Dashboard</h1>
            </header>

            {/* Content Section */}
            <div id="appCapsule">
                <div className="historicontent">
                    <p>Daftar histori presensi karyawan</p>
                </div>
                <div
                    id="chartdiv"
                    style={{ width: "100%", height: "400px" }}
                ></div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav
                activePage={activePage}
                isKaryawan={isKaryawan}
                statusJamKerja={statusJamKerja}
            />

            {/* Scripts */}
            <Script />
        </div>
    );
}
