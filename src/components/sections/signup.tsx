
"use client";
import { useState } from 'react'
import { useRouter } from "next/navigation";
// import { supabase } from '../lib/supabaseClient'
import Link from "next/link";

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("form data", email, password);
    
    // const { error } = await supabase.auth.signUp({ email, password })
    // if (error) setError(error.message)
    // else router.push('/login')
    setLoading(false)
  }

  return (
 <div className=" flex items-center justify-center transition-colors duration-300">
  <form
    onSubmit={handleSignUp}
    className=""
  >
    {/* Heading */}
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
      Create Your Account ✨
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
      className="w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
    >
      {loading ? "Signing up..." : "Sign Up"}
    </button>

    {/* Error Message */}
    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
  </form>
</div>


  )
}
