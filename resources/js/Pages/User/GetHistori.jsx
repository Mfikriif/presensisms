import React, { useState } from "react";

export default function GetHistori({ histori }) {
    const basePath = "/storage/uploads/absensi/";
    const defaultImage = "/assets/img/sample/avatar/avatar1.jpg";

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(histori.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = histori.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <ul className="listview image-listview space-y-4">
                {currentItems.map((d, index) => {
                    const imagePath = d.foto_in
                        ? `${basePath}${d.foto_in}`
                        : defaultImage;

                    const isIzin = d.status === "i";
                    const isSakit = d.status === "s";

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
                            <div className="flex-shrink-0">
                                <img
                                    src={imagePath}
                                    alt="Foto Absen"
                                    className="rounded-full w-16 h-16 object-cover border-2 border-gray-300"
                                />
                            </div>

                            <div className="ml-4 flex-grow">
                                <h3 className="text-base font-semibold text-gray-800 mb-1">
                                    {new Date(
                                        d.tanggal_presensi
                                    ).toLocaleDateString("id-ID", {
                                        weekday: "long",
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

                                {(isIzin || isSakit) && (
                                    <div className="mt-1 text-sm text-gray-600">
                                        <span className="font-medium">
                                            Keterangan:
                                        </span>{" "}
                                        {d.keterangan || "-"}
                                    </div>
                                )}

                                {!isIzin && !isSakit && (
                                    <div className="mt-1 text-sm text-gray-600 space-y-1">
                                        {d.jam_in && (
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium text-green-600">
                                                    Jam Masuk:
                                                </span>
                                                <span>{d.jam_in}</span>

                                                {d.terlambat ? (
                                                    <span className="text-[11px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded">
                                                        Terlambat{" "}
                                                        {Math.floor(
                                                            d.terlambat_menit /
                                                                60
                                                        ) > 0 && (
                                                            <>
                                                                {Math.floor(
                                                                    d.terlambat_menit /
                                                                        60
                                                                )}{" "}
                                                                jam{" "}
                                                            </>
                                                        )}
                                                        {d.terlambat_menit % 60}{" "}
                                                        menit
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-semibold bg-green-500 text-white px-2 py-0.5 rounded">
                                                        Tepat Waktu
                                                    </span>
                                                )}
                                            </p>
                                        )}

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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
                >
                    Sebelumnya
                </button>
                <span className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
                >
                    Selanjutnya
                </button>
            </div>
        </div>
    );
}
