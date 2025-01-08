import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";

export default function Login({ status, errors }) {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post("/login", data);
    };

    return (
        <>
            <Head title="Log in" />
            <div
                id="appCapsule"
                className="min-h-screen flex items-center justify-center bg-gray-100"
            >
                {/* Loader */}
                <div
                    id="loader"
                    className="fixed top-0 left-0 w-full h-full bg-white z-50 items-center justify-center hidden"
                >
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    ></div>
                </div>

                {/* Login Form */}
                <div className="login-form bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                    <div className="section text-center">
                        <img
                            src="/assets/img/login/sms.jpg"
                            alt="Login Illustration"
                            className="form-image w-52 h-52 mx-auto mb-"
                        />
                        <h1 className="text-2xl font-bold text-gray-700">
                            E-Presensi
                        </h1>
                        <p className="text-gray-500">
                            Silahkan login untuk melanjutkan
                        </p>
                    </div>

                    <div className="section mt-6">
                        {/* Status Message */}
                        {/* {status && (
                            <div className="alert alert-outline-success bg-green-100 text-green-700 px-4 py-2 rounded">
                                {status}
                            </div>
                        )} */}

                        {/* Error Messages */}
                        {/* {errors && (
                            <div className="alert alert-outline-warning bg-red-100 text-red-700 px-4 py-2 rounded">
                                {Object.keys(errors).map((key) => (
                                    <p key={key}>{errors[key]}</p>
                                ))}
                            </div>
                        )} */}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-group">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                        id="email"
                                        placeholder="Masukkan email Anda"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                    <i className="clear-input absolute top-1/2 transform -translate-y-1/2 right-4">
                                        <ion-icon name="close-circle"></ion-icon>
                                    </i>
                                </div>
                            </div>

                            <div className="form-group">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        className="form-control block w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                        id="password"
                                        placeholder="Masukkan password Anda"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                    <div
                                        className="icon-right absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer text-gray-600"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <ion-icon
                                            name={
                                                showPassword
                                                    ? "eye-outline"
                                                    : "eye-off-outline"
                                            }
                                            style={{ fontSize: "1.5rem" }}
                                        ></ion-icon>
                                    </div>
                                </div>
                            </div>

                            <div className="form-links mt-2 flex justify-between">
                                <a
                                    href="/register"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Register Now
                                </a>
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <div className="form-button-group">
                                <button
                                    type="submit"
                                    className="btn btn-success w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
