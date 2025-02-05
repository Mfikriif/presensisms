import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function Login({ status, errors }) {
    const { data, setData, post, processing } = useForm({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    // Simulasi Splash Screen
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <img
                    src="/assets/img/login/sms.jpg"
                    alt="Splash Logo"
                    className="w-48 h-48 animate-pulse"
                />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-6 relative"
            style={{
                backgroundImage: "url('/assets/img/bringin.jpg')",
            }}
        >
            {/* Overlay Transparan */}
            <div className="absolute inset-0 bg-black bg-opacity-5 backdrop-blur-sm"></div>

            {/* Login Form */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-lg rounded-lg p-6 w-full max-w-sm">
                <div className="text-center">
                    <img
                        src="/assets/img/login/sms-nobg.png"
                        alt="Login Logo"
                        className="w-44 h-44 mx-auto mb-3"
                    />
                    <h1 className="text-xl font-bold text-gray-800">
                        E-Presensi
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Silahkan login untuk melanjutkan
                    </p>
                </div>

                <div className="mt-6">
                    {/* Status Message */}
                    {status && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center">
                            {status}
                        </div>
                    )}

                    {/* Error Messages */}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key]}</p>
                            ))}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            post("/login");
                        }}
                        className="space-y-4"
                    >
                        {/* Email Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 text-sm"
                                placeholder="Masukkan email Anda"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-500 text-sm"
                                placeholder="Masukkan password Anda"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                            <span
                                className="absolute right-4 top-10 cursor-pointer text-gray-500 text-lg"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <ion-icon
                                    name={
                                        showPassword
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                ></ion-icon>
                            </span>
                        </div>

                        {/* Form Links */}
                        <div className="flex justify-between text-xs">
                            <a
                                href="/register"
                                className="text-blue-600 hover:underline"
                            >
                                Register Now
                            </a>
                            <a
                                href="/forgot-password"
                                className="text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-3 text-white rounded-lg transition duration-300 text-sm ${
                                processing
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            disabled={processing}
                        >
                            {processing ? "Loading..." : "Log in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
