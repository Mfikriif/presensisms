import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { MdCoPresent, MdOutlineSick } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { IoIosPaper } from "react-icons/io";
import { BiSolidTimeFive } from "react-icons/bi";

export default function Dashboard({ rekappresensi, totalPegawai }) {
    return (
        <>
            <AuthenticatedLayout
                header={<h1> Dashboard Admin</h1>}
                children={
                    <>
                        <Head title="Dashboard Admin" />
                        <div className="max-w-screen-xl mx-auto p-6">
                            <div className="flex flex-row justify-evenly">
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <MdCoPresent className="w-10 h-10 text-green-600" />
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{rekappresensi.total_hadir}</h2>
                                        <p>Karyawan Hadir</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <IoPeopleSharp className="h-10 w-10 text-white bg-blue-600" />
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{totalPegawai}</h2>
                                        <p>Jumlah Karyawan</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <IoIosPaper className="w-10 h-10 text-white bg-orange-500" />
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>142</h2>
                                        <p>Karyawan Izin</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <MdOutlineSick className="w-10 h-10 bg-red-500 text-white" />
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>142</h2>
                                        <p>Karyawan Sakit</p>
                                    </div>
                                </div>
                                <div className="bg-white flex flex-row w-52 h-14 text-sm justify-evenly rounded-md">
                                    <div className="my-auto">
                                        <span>
                                            <BiSolidTimeFive className="w-10 h-10 bg-red-500 text-white" />
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>{rekappresensi.terlambat}</h2>
                                        <p>Karyawan Terlambat</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
}
