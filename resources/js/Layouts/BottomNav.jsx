import React from "react";

export default function BottomNav({ activePage, isKaryawan, statusJamKerja }) {
    return (
        <div className="appBottomMenu">
            <a
                href="/dashboard"
                className={`item ${activePage === "dashboard" ? "active" : ""}`}
            >
                <div className="col">
                    <ion-icon name="home-outline"></ion-icon>
                    <strong>Home</strong>
                </div>
            </a>
            <a
                href="/presensi/histori"
                className={`item ${
                    activePage === "presensi/histori" ? "active" : ""
                }`}
            >
                <div className="col">
                    <ion-icon name="document-text-outline"></ion-icon>
                    <strong>Histori</strong>
                </div>
            </a>
            {isKaryawan && statusJamKerja === 1 ? (
                <a href="/presensi/null/create" className="item">
                    <div className="col">
                        <div className="action-button large">
                            <ion-icon name="camera-outline"></ion-icon>
                        </div>
                    </div>
                </a>
            ) : (
                <a href="/presensi/pilihjamkerja" className="item">
                    <div className="col">
                        <div className="action-button large">
                            <ion-icon name="camera-outline"></ion-icon>
                        </div>
                    </div>
                </a>
            )}
            <a
                href="/presensi/izin"
                className={`item ${
                    activePage === "presensi/izin" ? "active" : ""
                }`}
            >
                <div className="col">
                    <ion-icon name="calendar-outline"></ion-icon>
                    <strong>Izin</strong>
                </div>
            </a>
            <a
                href="/editprofile"
                className={`item ${
                    activePage === "editprofile" ? "active" : ""
                }`}
            >
                <div className="col">
                    <ion-icon name="people-outline"></ion-icon>
                    <strong>Profile</strong>
                </div>
            </a>
        </div>
    );
}
