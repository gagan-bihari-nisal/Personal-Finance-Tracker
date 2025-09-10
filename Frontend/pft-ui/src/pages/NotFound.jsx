import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
                <p className="text-gray-600 mb-6">
                    Something went wrong. The page you’re looking for doesn’t exist.
                </p>

                {token ? (
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-2 rounded-lg text-white font-medium bg-emerald-600 hover:bg-emerald-700"
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-2 rounded-lg text-white font-medium bg-emerald-600 hover:bg-emerald-700"
                    >
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
}