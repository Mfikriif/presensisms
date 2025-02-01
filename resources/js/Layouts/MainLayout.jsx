import React from "react";
import BottomNav from "@/Layouts/BottomNav";

export default function MainLayout({ children }) {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full max-w-none">
            <main className="flex-grow">{children}</main>

            {/* Bottom Navigation hanya dirender sekali */}
            <BottomNav />
        </div>
    );
}
