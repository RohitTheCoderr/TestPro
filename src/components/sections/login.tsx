// File: pages/login.tsx
"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setAuthToken, setUser } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import ResetPassword from "./resetPassword";
import { toast } from "sonner";
import { apiClient } from "@/lib/API/apiClient";
import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      userId: string;
      name: string;
      email: string;
      role: "admin" | "student";
    };
    token: string;
  };
}

export default function Login() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgetpass, setForgetpass] = useState(false);

  // const dispatch = useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post<LoginResponse>(
        "/user/auth/login",
        credentials,
      );
      if (!response.success) {
        throw new Error(response.message || "Login failed.");
      }
      return response;
    },
    onSuccess: (response) => {
      const user = response.data.user;
      dispatch(setAuthToken(response.data.token));
      dispatch(setUser(user));
      toast.success(`Welcome back, ${user.name || "User"}!`);
      router.push(user.role === "admin" ? "/admin" : "/");
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof Error ? mutationError.message : "Server error";
      setError(message);
      toast.error(message);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (!contact) {
      toast.warning("Please provide your email");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(contact)) {
      toast.warning("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.warning("please provide Passwords");
      return;
    }

    const bodyData = { email: contact, password };

    loginMutation.mutate(bodyData);
  };

  return (
    <>
      {" "}
      {!forgetpass ? (
        <div className="flex w-full items-center justify-center text-gray-800 transition-colors duration-300 dark:text-gray-100">
          <form
            onSubmit={handleLogin}
            // className="bg-white dark:bg-gray-800 p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300"
            className="w-full"
          >
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              Log In to <span className="text-primary">TestPro</span>
            </h2>

            {/* Email */}
            <input
              type="email"
              placeholder="Email address"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-cyan-950"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-cyan-950"
            />

            {/* Submit Button */}
            <Button
              size="xl"
              type="submit"
              className="w-full rounded-xl text-base font-semibold shadow-md"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
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
