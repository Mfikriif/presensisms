import React, { useState } from "react";
import BottomNav from "@/Layouts/BottomNav";
import Swal from "sweetalert2";

export default function BuatIzin() {
    const [tglIzin, setTglIzin] = useState("");
    const [status, setStatus] = useState("");
    const [keterangan, setKeterangan] = useState("");

    const handleTanggalChange = async (e) => {
        const value = e.target.value;
        setTglIzin(value);

        try {
            const response = await fetch("/presensi/cekpengajuanizin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({ tanggal_izin: value }),
            });

            const data = await response.json();
            if (data === 1) {
                Swal.fire({
                    title: "Oops!",
                    text: "Anda Sudah Melakukan Input Pengajuan Izin Pada Tanggal Tersebut!",
                    icon: "warning",
                }).then(() => {
                    setTglIzin("");
                });
            }
        } catch (error) {
            console.error("Error checking date:", error);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!tglIzin) {
            Swal.fire({
                title: "Oops!",
                text: "Tanggal Harus Diisi",
                icon: "warning",
            });
            return;
        }

        if (!status) {
            Swal.fire({
                title: "Oops!",
                text: "Status Harus Diisi",
                icon: "warning",
            });
            return;
        }

        if (!keterangan) {
            Swal.fire({
                title: "Oops!",
                text: "Keterangan Harus Diisi",
                icon: "warning",
            });
            return;
        }

        document.getElementById("frmIzin").submit();
    };

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
                <h1 className="text-lg font-semibold">Form Izin</h1>
            </div>

            {/* Form */}
            <div className="p-4">
                <form
                    method="POST"
                    action={"/presensi/storeizin"}
                    id="frmIzin"
                    onSubmit={handleFormSubmit}
                    className="space-y-4"
                >
                    <input
                        type="hidden"
                        name="_token"
                        value={
                            document.querySelector('meta[name="csrf-token"]')
                                .content
                        }
                    />

                    {/* Tanggal */}
                    <div className="form-group">
                        <input
                            type="date"
                            id="tanggal_izin"
                            name="tanggal_izin"
                            value={tglIzin}
                            onChange={handleTanggalChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                            placeholder="Tanggal"
                        />
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <select
                            name="status"
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Izin / Sakit</option>
                            <option value="i">Izin</option>
                            <option value="s">Sakit</option>
                        </select>
                    </div>

                    {/* Keterangan */}
                    <div className="form-group">
                        <textarea
                            name="keterangan"
                            id="keterangan"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                            cols="30"
                            rows="5"
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                            placeholder="Keterangan"
                        ></textarea>
                    </div>

                    {/* Tombol Kirim */}
                    <div className="form-group">
                        <button
                            type="submit"
                            className="w-full bg-blue-950 text-white py-2 px-4 rounded-md shadow hover:bg-blue-900 transition duration-200"
                        >
                            Kirim
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
