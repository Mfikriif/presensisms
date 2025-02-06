import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Swal from "sweetalert2";

export default function BuatIzin() {
    const [tglIzin, setTglIzin] = useState("");
    const [status, setStatus] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [fileIzin, setFileIzin] = useState(null);
    const [izinSudahAda, setIzinSudahAda] = useState(false);

    // Fungsi untuk menghandle perubahan tanggal
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
                setIzinSudahAda(true);
                Swal.fire({
                    title: "Oops!",
                    text: "Anda sudah mengajukan izin pada tanggal ini! Silakan pilih tanggal lain.",
                    icon: "warning",
                    confirmButtonText: "Oke",
                }).then(() => {
                    setTglIzin(""); // Reset input jika sudah ada izin
                });
            } else {
                setIzinSudahAda(false);
            }
        } catch (error) {
            console.error("Error checking date:", error);
        }
    };

    // Fungsi untuk menghandle submit form
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validasi input
        if (izinSudahAda) {
            Swal.fire({
                title: "Gagal!",
                text: "Anda sudah mengajukan izin untuk tanggal ini.",
                icon: "error",
            });
            return;
        }

        if (!tglIzin) {
            Swal.fire({
                title: "Oops!",
                text: "Tanggal harus diisi",
                icon: "warning",
            });
            return;
        }

        if (!status) {
            Swal.fire({
                title: "Oops!",
                text: "Status harus diisi",
                icon: "warning",
            });
            return;
        }

        if (!keterangan) {
            Swal.fire({
                title: "Oops!",
                text: "Keterangan harus diisi",
                icon: "warning",
            });
            return;
        }

        if (!fileIzin) {
            Swal.fire({
                title: "Oops!",
                text: "File izin harus diunggah",
                icon: "warning",
            });
            return;
        }

        const formData = new FormData();
        formData.append("tanggal_izin", tglIzin);
        formData.append("status", status);
        formData.append("keterangan", keterangan);
        formData.append("file", fileIzin);
        formData.append(
            "_token",
            document.querySelector('meta[name="csrf-token"]').content
        );

        fetch("/presensi/storeizin", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    Swal.fire({
                        title: "Berhasil!",
                        text: "Pengajuan izin berhasil dikirim.",
                        icon: "success",
                        confirmButtonText: "Oke",
                    }).then(() => {
                        window.location.href = "/presensi/izin";
                    });
                } else {
                    Swal.fire({
                        title: "Gagal!",
                        text: data.message || "Terjadi kesalahan.",
                        icon: "error",
                    });
                }
            })
            .catch((error) => {
                console.error("Error submitting form:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan saat mengirim data.",
                    icon: "error",
                });
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validasi ekstensi file
            const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                Swal.fire({
                    title: "Format File Tidak Didukung",
                    text: "Hanya diperbolehkan file PDF, JPG, atau PNG.",
                    icon: "error",
                });
                return;
            }

            // Validasi ukuran file (maksimal 2MB)
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    title: "Ukuran File Terlalu Besar",
                    text: "Maksimal ukuran file adalah 2MB.",
                    icon: "error",
                });
                return;
            }

            setFileIzin(file); // Simpan file ke state
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-100 min-h-screen overflow-y-auto relative">
                {/* Header */}
                <div className="bg-blue-950 text-white flex items-center justify-between px-4 py-3 shadow-md">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-white"
                    >
                        <ion-icon
                            name="chevron-back-outline"
                            className="text-2xl"
                        ></ion-icon>
                        <span className="ml-2 text-sm">Kembali</span>
                    </button>
                    <h1 className="text-lg font-semibold">Form Izin</h1>
                </div>

                {/* Form */}
                <div className="p-4">
                    <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4"
                        encType="multipart/form-data"
                    >
                        {/* Tanggal */}
                        <div className="form-group">
                            <input
                                type="date"
                                id="tanggal_izin"
                                name="tanggal_izin"
                                value={tglIzin}
                                onChange={handleTanggalChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring ${
                                    izinSudahAda
                                        ? "border-red-500 bg-red-100"
                                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                                }`}
                                placeholder="Tanggal"
                            />
                            {izinSudahAda && (
                                <p className="text-red-500 text-sm mt-1">
                                    Anda sudah mengajukan izin pada tanggal ini.
                                </p>
                            )}
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

                        {/* Upload File Izin */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-gray-700">
                                Upload File Izin (PDF/JPG/PNG){" "}
                                {status === "s" && (
                                    <span className="text-red-500">*</span>
                                )}
                            </label>

                            <input
                                type="file"
                                name="file"
                                accept=".pdf, .jpg, .jpeg, .png"
                                onChange={handleFileChange} // Panggil fungsi handleFileChange
                                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />

                            {/* Tampilkan pesan error jika file tidak diunggah untuk sakit */}
                            {status === "s" && !fileIzin && (
                                <p className="text-red-500 text-sm mt-1">
                                    Bukti sakit wajib diunggah!
                                </p>
                            )}

                            {/* Tampilkan nama file jika sudah dipilih */}
                            {fileIzin && (
                                <p className="text-green-600 text-sm mt-1">
                                    File terpilih: {fileIzin.name}
                                </p>
                            )}
                        </div>

                        {/* Tombol Kirim */}
                        <div className="form-group">
                            <button
                                type="submit"
                                className="w-full bg-blue-950 text-white py-2 px-4 rounded-md shadow hover:bg-blue-900 transition duration-200 disabled:bg-gray-400"
                                disabled={izinSudahAda}
                            >
                                Kirim
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
