import React, { useState, useEffect } from "react";
import Presensi from "@/Layouts/Presensi";
import Script from "@/Layouts/Script";
import { Inertia } from "@inertiajs/inertia";

export default function Profile({}) {
    return (
        <div className="bg-gray-100 min-h-screen overflow-y-auto pb-16">
            {/* Bottom Navigation */}
            <Presensi />
            {/* Scripts */}
            <Script />
        </div>
    );
}
