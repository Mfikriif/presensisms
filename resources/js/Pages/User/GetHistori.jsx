import React from "react";

export default function GetHistori({ histori }) {
    const basePath = "/storage/uploads/absensi/";
    const defaultImage = "/assets/img/sample/avatar/avatar1.jpg"; // Gambar default jika foto tidak ditemukan

    return (
        <ul className="listview image-listview space-y-2">
            {histori.map((d, index) => {
                const imagePath = d.foto_in
                    ? `${basePath}${d.foto_in}`
                    : defaultImage;

                // Tentukan tipe kehadiran
                const isIzin = d.status === "i";
                const isSakit = d.status === "s";

                // Label status kehadiran
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
                        className="flex items-center bg-white rounded-lg shadow-sm p-3 transition duration-300 hover:shadow-md"
                    >
                        {/* Image Section */}
                        <div className="flex-shrink-0">
                            <img
                                src={imagePath}
                                alt="Foto Absen"
                                className="rounded-full w-12 h-12 object-cover border border-gray-300"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="ml-3 flex-grow">
                            <h3 className="text-sm font-semibold text-gray-800">
                                {new Date(
                                    d.tanggal_presensi
                                ).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h3>

                            {/* Status Kehadiran */}
                            <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded ${statusColor}`}
                            >
                                {statusLabel}
                            </span>

                            {/* Keterangan untuk izin/sakit */}
                            {(isIzin || isSakit) && (
                                <p className="text-xs text-gray-600 mt-1">
                                    <span className="font-medium">
                                        Keterangan:
                                    </span>{" "}
                                    {d.keterangan || "-"}
                                </p>
                            )}

                            {/* Jika hadir, tampilkan jam masuk & jam pulang */}
                            {!isIzin && !isSakit && (
                                <div className="mt-1 text-xs text-gray-600">
                                    <p>
                                        <span className="font-medium text-green-600">
                                            Masuk:
                                        </span>{" "}
                                        {d.jam_in || "-"}
                                    </p>
                                    <p>
                                        <span className="font-medium text-red-600">
                                            Pulang:
                                        </span>{" "}
                                        {d.jam_out || "-"}
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
