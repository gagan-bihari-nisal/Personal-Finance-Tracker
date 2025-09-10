// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { username, password });
            const token = res.data?.token;
            if (!token) throw new Error("No token returned from server");
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || err.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-emerald-700">
                        Personal Finance Tracker
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-emerald-600"
                            >
                                {showPassword ? "hide" : "show"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="text-center text-sm text-gray-500 space-y-2">
                        <div>
                            Don’t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-emerald-600 underline"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
