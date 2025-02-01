import React from "react";

export default function GetHistori({ histori }) {
    const basePath = "/storage/uploads/absensi/";
    const defaultImage = "/assets/img/sample/avatar/avatar1.jpg"; // Gambar default jika foto tidak ditemukan

    return (
        <ul className="listview image-listview space-y-4">
            {histori.map((d, index) => {
                console.log("Data jam_in:", d.jam_in); // Debug data
                const imagePath = d.foto_in
                    ? `${basePath}${d.foto_in}`
                    : defaultImage;

                // Tentukan tipe kehadiran
                const isIzin = d.status === "i";
                const isSakit = d.status === "s";

                // Tampilkan jenis izin/sakit/hadir
                const statusLabel = isIzin
                    ? "Izin"
                    : isSakit
                    ? "Sakit"
                    : "Hadir";
                const statusColor = isIzin
                    ? "bg-yellow-500 text-white"
                    : isSakit
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white";

                return (
                    <li
                        key={index}
                        className="flex items-center bg-white rounded-lg shadow-md p-4"
                    >
                        {/* Image Section */}
                        <div className="flex-shrink-0">
                            <img
                                src={imagePath}
                                alt="Foto Absen"
                                className="rounded-full w-16 h-16 object-cover border-2 border-gray-300"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="ml-4 flex-grow">
                            <h3 className="text-base font-semibold text-gray-800 mb-1">
                                {new Date(
                                    d.tanggal_presensi
                                ).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 space-x-2">
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg shadow-sm ${statusColor}`}
                                >
                                    {statusLabel}
                                </span>
                            </div>

                            {/* Jika izin atau sakit, tampilkan keterangan */}
                            {(isIzin || isSakit) && (
                                <div className="mt-1 text-sm text-gray-600">
                                    <span className="font-medium">
                                        Keterangan:
                                    </span>{" "}
                                    {d.keterangan || "-"}
                                </div>
                            )}

                            {/* Jika hadir, tampilkan jam masuk dan pulang tanpa badge */}
                            {!isIzin && !isSakit && (
                                <div className="mt-1 text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium text-green-600">
                                            Jam Masuk:
                                        </span>{" "}
                                        {d.jam_in || "Tidak Absen"}
                                    </p>
                                    <p>
                                        <span className="font-medium text-red-600">
                                            Jam Pulang:
                                        </span>{" "}
                                        {d.jam_out || "Tidak Absen"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
