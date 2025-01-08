import React from "react";
import BottomNav from "./BottomNav";
import Script from "./Script";

export default function Presensi({ children }) {
    return (
        <>
            <head>
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta
                    httpEquiv="Cache-Control"
                    content="no-cache, no-store, must-revalidate"
                />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black-translucent"
                />
                <meta name="theme-color" content="#000000" />
                <title>Dashboard</title>
                <meta
                    name="description"
                    content="Mobilekit HTML Mobile UI Kit"
                />
                <meta
                    name="keywords"
                    content="bootstrap 4, mobile template, cordova, phonegap, mobile, html"
                />
                <link
                    rel="icon"
                    type="image/png"
                    href="assets/img/favicon.png"
                    sizes="32x32"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="assets/img/icon/192x192.png"
                />
                <link rel="manifest" href="__manifest.json" />
            </head>

            <div className="bg-gray-100 min-h-screen flex flex-col">
                {/* Loader */}
                <div
                    id="loader"
                    className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50"
                >
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
                {/* End Loader */}

                {/* App Capsule */}
                <div id="appCapsule" className="flex-grow p-4">
                    {children}
                </div>
                {/* End App Capsule */}

                {/* Bottom Navigation */}
                <BottomNav />

                {/* Scripts */}
                <Script />
            </div>
        </>
    );
}
