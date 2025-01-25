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

                // Warna badge berdasarkan jam masuk
                const badgeClassMasuk = d.jam_in
                    ? d.jam_in < "07:00:00"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    : "bg-gray-500 text-white";

                // Warna badge berdasarkan jam pulang
                const badgeClassPulang = d.jam_out
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white";

                return (
                    <li
                        key={index}
                        className="flex items-center bg-white rounded-lg shadow-md p-4 transition duration-300 hover:shadow-lg"
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
                                <span className="font-medium">Jam Masuk:</span>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg shadow-sm ${badgeClassMasuk}`}
                                >
                                    {d.jam_in || "Tidak Absen"}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 space-x-2 mt-1">
                                <span className="font-medium">Jam Pulang:</span>
                                <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg shadow-sm ${badgeClassPulang}`}
                                >
                                    {d.jam_out || "Tidak Absen"}
                                </span>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
