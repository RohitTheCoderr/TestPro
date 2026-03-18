// File: pages/login.tsx
"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setAuthToken, setUser } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ResetPassword from "./resetPassword";
import { toast } from "sonner";

export default function Login() {
  const [contact, setContact] = useState(""); // email or mobile
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgetpass, setForgetpass] = useState(false);

  // const dispatch = useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error

    if (!password) {
      toast.warning("please provide Passwords");
      return;
    }
    if (!contact) {
      toast.warning("please provide Email or mobile");
      return;
    }

    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    const bodyData = isEmail
      ? { email: contact, password } // send email
      : { mobile: `+91${contact}`, password }; // send mobile

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        },
      );

      const data = await res.json();
      if (res.ok) {
        const isAdmin = data?.data?.user;
        dispatch(setAuthToken(data?.data?.token));
        dispatch(setUser(isAdmin));

        if (isAdmin.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.message(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      {!forgetpass ? (
        <div className=" flex items-center justify-center text-gray-800 dark:text-gray-100 transition-colors duration-300">
          <form
            onSubmit={handleLogin}
            // className="bg-white dark:bg-gray-800 p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300"
            className=""
          >
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              Log In to <span className="text-primary">TestPro</span>
            </h2>

            {/* Email */}
            <input
              type="text"
              placeholder="Email or Mobile"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
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
            <Button
              size="xl"
              type="submit"
              className="w-full text-white rounded-full text-lg font-semibold shadow-md"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>

            <div
              className="text-primary text-sm text-right mt-2 cursor-pointer hover:text-accent"
              onClick={() => setForgetpass(true)}
            >
              Forget password
            </div>
            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </form>
        </div>
      ) : (
        <ResetPassword setForgetpass={setForgetpass} />
      )}
    </>
  );
}
