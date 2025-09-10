// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // ✅ import Link
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-xl font-semibold text-emerald-700 mb-4">
          Create account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            className="w-full py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* ✅ Back to Login button (SPA navigation) */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-500">Already have an account?</span>{" "}
          <Link to="/login" className="text-emerald-600 underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
