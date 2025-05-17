export default function CetakLaporan({
    histori,
    bulan,
    tahun,
    error,
    // statusPresensi,
    dataPegawai,
    rekapLengkap,
}) {
    const pegawai = histori[0];
    const namabulan = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "Novermber",
        "Desember",
    ];

    // console.log("status Presensi", statusPresensi);
    console.log("rekap Lengkap", rekapLengkap);
    const getNamaBulan = (bulan) => namabulan[bulan - 1];

    // Fungsi untuk mengonversi waktu ke detik total
    const parseTimeToSeconds = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return hours * 3600 + minutes * 60 + (seconds || 0);
    };

    // Menghitung selisih keterlambatan dalam menit
    const hitungJamKeterlambatan = (jamIn, batasJamMasuk) => {
        const selisih =
            parseTimeToSeconds(jamIn) - parseTimeToSeconds(batasJamMasuk);
        return selisih > 0
            ? `terlambat ${Math.floor(selisih / 60)} menit`
            : "Tepat waktu";
    };

    const menghitungTotalJam = (jamIn, jamOut) => {
        if (!jamIn || !jamOut) return "-";

        const convertToMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const totalMinutes = convertToMinutes(jamOut) - convertToMinutes(jamIn);

        if (totalMinutes < 0) return "Waktu tidak valid"; // Handle jam_out lebih kecil dari jam_in

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours} jam ${minutes} menit`;
    };

    return (
        <div style={styles.page}>
            <div className="flex mb-10 w-3/4">
                <div className="w-32 h-32 mr-2">
                    <img src="/assets/img/login/sms.jpg" alt="Login Image" />
                </div>
                <div className="w-full">
                    <h1 className="font-bold">LAPORAN PRESENSI PEGAWAI</h1>
                    <h1 className="font-bold">
                        PERIODE {getNamaBulan(bulan).toUpperCase()} {tahun}
                    </h1>
                    <h1 className="font-bold">PT.SIDOREJO MAKMUR SEJAHTERA</h1>
                    <h1 className="text-sm text-slate-600 italic">
                        Jl. Raya Semarang - Demak Km. 13, Bandungrejo, Kec.
                        Mranggen, Kabupaten Demak, Jawa Tengah 59567
                    </h1>
                </div>
            </div>
            {dataPegawai && (
                <div className="flex -mt-4" style={styles.info}>
                    <div className="w-24 h-24 overflow-hidden mr-3 mt-2">
                        <img src={`storage/${dataPegawai.foto}`} alt="" />
                    </div>
                    <div className="flex flex-col justify-evenly">
                        <p>
                            Kode Pegawai <span className="ml-1">:</span>
                            <span className="ml-2">{dataPegawai.id}</span>
                        </p>
                        <p>
                            Nama <span className="ml-14">:</span>
                            <span className="ml-2">
                                {dataPegawai.nama_lengkap}
                            </span>
                        </p>
                        <p>
                            Posisi <span className="ml-14">:</span>
                            <span className="ml-2">{dataPegawai.posisi}</span>
                        </p>
                        <p>
                            No Hp <span className="ml-14">:</span>
                            <span className="ml-2">{dataPegawai.no_hp}</span>
                        </p>
                    </div>
                </div>
            )}
            {error ? (
                <p style={styles.error}>{error}</p>
            ) : (
                <>
                    <table className="text-center" style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>No</th>
                                <th style={styles.th}>Tanggal</th>
                                <th style={styles.th}>Jam Masuk</th>
                                <th style={styles.th}>Foto</th>
                                <th style={styles.th}>Jam Keluar</th>
                                <th style={styles.th}>Foto</th>
                                <th style={styles.th}>Status</th>
                                {/* <th style={styles.th}>Izin / Sakit</th> */}
                                <th style={styles.th}>Jml Jam</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rekapLengkap.map((item, index) => (
                                <tr className="text-center" key={index}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td
                                        className="whitespace-nowrap"
                                        style={styles.td}
                                    >
                                        {item.tanggal}
                                    </td>
                                    <td style={styles.td}>{item.jam_in}</td>
                                    <td style={styles.td}>
                                        <img
                                            src={
                                                item.foto_in
                                                    ? `/storage/uploads/absensi/${item.foto_in}`
                                                    : "assets/img/nophoto.png"
                                            }
                                            alt="Foto Masuk"
                                            className="h-12 w-12 object-cover"
                                        />
                                    </td>
                                    <td style={styles.td}>
                                        {!item.jam_out
                                            ? item.jam_pulang
                                            : item.jam_out}
                                    </td>
                                    <td style={styles.td}>
                                        <img
                                            src={
                                                item.foto_out
                                                    ? `/storage/uploads/absensi/${item.foto_out}`
                                                    : "assets/img/nophoto.png"
                                            }
                                            alt="Foto Masuk"
                                            className="h-12 w-12 object-cover"
                                        />
                                    </td>
                                    <td style={styles.td}>
                                        {!item.jam_in && !item.jam_out ? (
                                            item.status === "i" ? (
                                                <span>Izin</span>
                                            ) : item.status === "s" ? (
                                                <span>Sakit</span>
                                            ) : (
                                                <span>-</span> // Tidak absen tanpa keterangan
                                            )
                                        ) : item.jam_in && item.jam_out ? (
                                            item.jam_in > item.jam_masuk ? (
                                                <span>
                                                    {hitungJamKeterlambatan(
                                                        item.jam_in,
                                                        item.jam_masuk
                                                    )}
                                                </span>
                                            ) : (
                                                <span>Tepat Waktu</span>
                                            )
                                        ) : (
                                            <span>-</span> // Data tidak lengkap
                                        )}
                                    </td>

                                    <td style={styles.td}>
                                        {!item.jam_out
                                            ? menghitungTotalJam(
                                                  item.jam_in,
                                                  item.jam_pulang
                                              )
                                            : menghitungTotalJam(
                                                  item.jam_in,
                                                  item.jam_out
                                              )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <div style={styles.signatureContainer}>
                        <div style={styles.signatureBox}>
                            <p>
                                Demak, {new Date().toLocaleDateString("id-ID")}
                            </p>
                            <p>HRD Manager PT. SIDOREJO MAKMUR SEJAHTERA</p>
                            <div style={styles.signatureSpace}></div>
                            <p>
                                <strong>_______________________</strong>
                            </p>
                        </div>
                        <div style={styles.signatureBox}>
                            <p>
                                Demak, {new Date().toLocaleDateString("id-ID")}
                            </p>
                            <p>Direktur PT. SIDOREJO MAKMUR SEJAHTERA</p>
                            <div style={styles.signatureSpace}></div>
                            <p>
                                <strong>_______________________</strong>
                            </p>
                        </div>
                    </div> */}
                </>
            )}
        </div>
    );
}

const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        width: "210mm",
        minHeight: "297mm",
        margin: "auto",
        padding: "20mm",
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px",
    },
    info: {
        marginBottom: "20px",
        fontSize: "14px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
    },
    th: {
        border: "1px solid #ddd",
        padding: "8px",
        backgroundColor: "#f4f4f4",
        textAlign: "left",
    },
    td: {
        border: "1px solid #ddd",
        padding: "8px",
    },
    error: {
        color: "red",
        fontWeight: "bold",
    },
    signatureContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "90px",
        marginRight: "50px",
    },
    signatureBox: {
        textAlign: "center",
        fontSize: "14px",
    },
    signatureSpace: {
        height: "80px", // Ruang kosong untuk tanda tangan
    },
};
