import React from "react";

export default function BottomNav({ activePage }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-between items-center p-3">
            {/* Today */}
            <a
                href="#"
                className={`flex flex-col items-center ${
                    activePage === "today" ? "text-blue-500" : "text-gray-500"
                }`}
            >
                <ion-icon
                    name="file-tray-full-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Today</strong>
            </a>

            {/* Calendar */}
            <a
                href="#"
                className={`flex flex-col items-center ${
                    activePage === "calendar"
                        ? "text-blue-500"
                        : "text-gray-500"
                }`}
            >
                <ion-icon
                    name="calendar-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Calendar</strong>
            </a>

            {/* Camera */}
            <a href="#" className="flex justify-center items-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex justify-center items-center shadow-lg">
                    <ion-icon name="camera" className="text-2xl"></ion-icon>
                </div>
            </a>

            {/* Docs */}
            <a
                href="#"
                className={`flex flex-col items-center ${
                    activePage === "docs" ? "text-blue-500" : "text-gray-500"
                }`}
            >
                <ion-icon
                    name="document-text-outline"
                    className="text-2xl"
                ></ion-icon>
                <strong className="text-xs mt-1">Docs</strong>
            </a>

            {/* Profile */}
            <a
                href="#"
                className={`flex flex-col items-center ${
                    activePage === "profile" ? "text-blue-500" : "text-gray-500"
                }`}
            >
                <ion-icon name="people-outline" className="text-2xl"></ion-icon>
                <strong className="text-xs mt-1">Profile</strong>
            </a>
        </div>
    );
}
