import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function listPegawai() {
    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        List Pegawai
                    </h2>
                }
                children={<div></div>}
            />
        </>
    );
}
