import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { FaMapLocationDot } from "react-icons/fa6";
import Modal from "@/Components/Modal";
import "leaflet/dist/leaflet.css";

export default function MonitoringPresensi({ presensi, statusPresensi }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Jumlah item per halaman
    const [showModal, setShowModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: 0,
        longitude: 0,
        nama: "",
    });

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    // Fungsi untuk memfilter data berdasarkan input pencarian
    const filteredPresensi = presensi.filter((psn) =>
        `${psn.nama} ${psn.email} ${psn.tanggal_presensi} ${psn.jam_in} ${psn.jam_out} ${psn.lokasi_in} ${psn.lokasi_out}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Data untuk halaman yang sedang ditampilkan
    const pageCount = Math.ceil(filteredPresensi.length / itemsPerPage);
    const paginatedPresensi = filteredPresensi.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Fungsi untuk menangani perubahan halaman
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Fungsi untuk mengambil nilai latidude, longitude dan usernya
    function takeLocation(lokasi, namaUser) {
        const lokasiSplit = lokasi.split(",");
        const latitude = lokasiSplit[0];
        const longitude = lokasiSplit[1];

        setSelectedLocation({
            latitude,
            longitude,
            nama: namaUser,
        });

        setShowModal(true);
    }

    // Fungsi untuk menghitung jumlah jam keterlambatan
    function hitungJamKeterlambatan(jamMasuk, akhirJamMasuk) {
        if (!jamMasuk || !akhirJamMasuk) return null; // Jika data tidak lengkap

        const [jam1, menit1, detik1] = jamMasuk.split(":").map(Number);
        const [jam2, menit2, detik2] = akhirJamMasuk.split(":").map(Number);

        const waktuMasuk = new Date(0, 0, 0, jam1, menit1, detik1);
        const batasWaktu = new Date(0, 0, 0, jam2, menit2, detik2);

        // Jika tidak terlambat, waktuMasuk lebih kecil atau sama dengan batasWaktu
        if (waktuMasuk <= batasWaktu) {
            return "00:00:00";
        }

        const selisih = waktuMasuk - batasWaktu;
        const jamTerlambat = Math.floor(selisih / (1000 * 60 * 60));
        const menitTerlambat = Math.floor(
            (selisih % (1000 * 60 * 60)) / (1000 * 60)
        );
        const detikTerlambat = Math.floor((selisih % (1000 * 60)) / 1000);

        return `${jamTerlambat.toString().padStart(2, "0")}:${menitTerlambat
            .toString()
            .padStart(2, "0")}:${detikTerlambat.toString().padStart(2, "0")}`;
    }

    // Memperbarui bagian "combinedData" untuk memasukkan waktu keterlambatan
    const combinedData = presensi.map((psn) => {
        const status = statusPresensi.find(
            (status) =>
                status.nama === psn.nama &&
                status.tanggal_presensi === psn.tanggal_presensi
        );

        const akhirJamMasuk = status?.akhir_jam_masuk || "23:59:59";
        const statusTerlambat =
            psn.jam_in > akhirJamMasuk ? "Terlambat" : "Tepat Waktu";
        const jamKeterlambatan =
            statusTerlambat === "Terlambat"
                ? hitungJamKeterlambatan(psn.jam_in, akhirJamMasuk)
                : "00:00:00";

        return {
            ...psn,
            akhir_jam_masuk: akhirJamMasuk,
            status_terlambat: statusTerlambat,
            jam_keterlambatan: jamKeterlambatan, // Menambahkan jumlah jam keterlambatan
        };
    });

    // menampilkan map

    console.log("Modal dibuka:", showModal);

    useEffect(() => {
        let map;

        if (showModal) {
            setTimeout(() => {
                const mapElement = document.getElementById("map");
                if (!mapElement) {
                    console.error("Elemen #map tidak ditemukan");
                    return;
                }

                console.log("Elemen #map ditemukan");
                if (!mapElement._leaflet_id) {
                    map = L.map("map").setView(
                        [selectedLocation.latitude, selectedLocation.longitude],
                        13
                    );
                    L.tileLayer(
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                            maxZoom: 19,
                            attribution:
                                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        }
                    ).addTo(map);

                    L.marker([
                        selectedLocation.latitude,
                        selectedLocation.longitude,
                    ])
                        .addTo(map)
                        .bindPopup(`Lokasi Presensi ${selectedLocation.nama}`)
                        .openPopup();

                    L.circle(
                        [selectedLocation.latitude, selectedLocation.longitude],
                        {
                            color: "red",
                            fillColor: "#f03",
                            fillOpacity: 0.5,
                            radius: 500,
                        }
                    ).addTo(map);

                    console.log("Peta berhasil diinisialisasi");
                }
            }, 100);
        }

        return () => {
            if (map) {
                map.remove();
                console.log("Peta dihapus");
            }
        };
    }, [showModal, selectedLocation]);

    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Elemen #map tidak ditemukan");
    } else {
        console.log("Elemen #map ditemukan");
    }

    return (
        <>
            <AuthenticatedLayout
                header={<h1>Monitoring Presensi Pegawai</h1>}
                children={
                    <>
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            <Head title="Monitoring Pegawai" />
                            <div className="mx-auto max-w-7xl">
                                <div className="relative flex items-center mb-6 max-w-96">
                                    <FiSearch className="absolute left-3 text-gray-400" />
                                    <input
                                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                        type="text"
                                        placeholder="Cari berdasarkan nama, email, tanggal, dll..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="w-full overflow-auto text-sm">
                                    {/* Table presensi pegawai */}
                                    <table className="w-full border-collapse text-center">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-2 py-1">
                                                    No
                                                </th>
                                                <th className="px-2 py-1">
                                                    Nama
                                                </th>
                                                <th className="px-2 py-2">
                                                    Email
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap">
                                                    Tanggal Presensi
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap">
                                                    Jam Masuk
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap">
                                                    Foto Masuk
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap">
                                                    Jam Keluar
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap">
                                                    Foto Keluar
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap">
                                                    Keterangan
                                                </th>
                                                <th className="px-2 py-1 whitespace-nowrap"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedPresensi.length > 0 ? (
                                                combinedData.map(
                                                    (psn, index) => {
                                                        return (
                                                            <tr
                                                                key={
                                                                    psn.id ||
                                                                    index
                                                                }
                                                                className="even:bg-gray-50"
                                                            >
                                                                <td className="px-2 py-1 text-center">
                                                                    {currentPage *
                                                                        itemsPerPage +
                                                                        index +
                                                                        1}
                                                                </td>
                                                                <td className="px-2 py-1 whitespace-nowrap">
                                                                    {psn.nama}
                                                                </td>
                                                                <td className="px-2 py-2">
                                                                    {psn.email}
                                                                </td>
                                                                <td className="px-2 py-1 whitespace-nowrap">
                                                                    {
                                                                        psn.tanggal_presensi
                                                                    }
                                                                </td>
                                                                <td className="px-2 py-1">
                                                                    {psn.jam_in}
                                                                </td>
                                                                <td className="px-2 py-1">
                                                                    <img
                                                                        src={
                                                                            psn.foto_in
                                                                                ? `/storage/uploads/absensi/${psn.foto_in}`
                                                                                : "assets/img/nophoto.png"
                                                                        }
                                                                        alt="Foto Masuk"
                                                                        className="h-12 w-12 object-cover"
                                                                    />
                                                                </td>
                                                                <td className="px-2 py-1">
                                                                    {psn.jam_out ? (
                                                                        psn.jam_out
                                                                    ) : (
                                                                        <span className="bg-red-600 text-white rounded px-3 text-center py-1 whitespace-nowrap">
                                                                            Belum
                                                                            Absen
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-2 py-1">
                                                                    <img
                                                                        src={
                                                                            psn.foto_out
                                                                                ? `/storage/uploads/absensi/${psn.foto_out}`
                                                                                : "/assets/img/nophoto.png"
                                                                        }
                                                                        alt="Foto Keluar"
                                                                        className="h-12 w-12 object-cover"
                                                                    />
                                                                </td>
                                                                <td className="px-2 py-1 whitespace-nowrap">
                                                                    {psn.status_terlambat ===
                                                                    "Terlambat" ? (
                                                                        <span className="bg-red-600 text-white px-2 py-1 rounded">
                                                                            Terlambat{" "}
                                                                            {
                                                                                psn.jam_keterlambatan
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className="bg-green-600 text-white px-2 py-1 rounded">
                                                                            Tepat
                                                                            waktu
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-2 py-1 whitespace-nowrap">
                                                                    <button
                                                                        onClick={() =>
                                                                            takeLocation(
                                                                                psn.lokasi_in,
                                                                                psn.nama
                                                                            )
                                                                        }
                                                                    >
                                                                        <FaMapLocationDot className="text-xl hover:text-blue-500 hover:cursor-pointer" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="10"
                                                        className="text-center py-4 text-gray-500"
                                                    >
                                                        Tidak ada data presensi
                                                        tersedia
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Modal
                                    show={showModal}
                                    maxWidth="3xl"
                                    closeable={true}
                                    onClose={() => setShowModal(false)}
                                >
                                    <h1 className="text-center font-semibold py-3 border border-b-black mb-3">
                                        Lokasi Presensi User
                                    </h1>

                                    <div className="h-96 w-full px-6 py-4 mb-7">
                                        <div className="h-96" id="map"></div>
                                    </div>
                                </Modal>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6">
                                <ReactPaginate
                                    previousLabel={"← Sebelumnya"}
                                    nextLabel={"Selanjutnya →"}
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    containerClassName={
                                        "flex justify-center space-x-2"
                                    }
                                    pageClassName={"px-4 py-2"}
                                    previousClassName={"px-4 py-2"}
                                    nextClassName={"px-4 py-2"}
                                    activeClassName={
                                        "bg-blue-500 text-white font-bold"
                                    }
                                />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
