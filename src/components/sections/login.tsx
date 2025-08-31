// File: pages/login.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Login() {
//  const router = useRouter(); // This is now from 'next/navigation'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error
    setLoading(false);
  };

  return (
    <div className=" flex items-center justify-center text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        // className="bg-white dark:bg-gray-800 p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300"
        className=""
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
         Log In to <span className="text-blue-600 dark:text-blue-400">TestPro</span>
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-full text-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </form>
    </div>
  );
}
