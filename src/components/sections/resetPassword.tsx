"use client";
import { setAuthToken, setUser } from "@/lib/redux/slices/authSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/API/apiClient";
import { useMutation } from "@tanstack/react-query";

interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: {
    otpID?: string;
    user?: {
      userId: string;
      name: string;
      email: string;
      role: "admin" | "student";
    };
    token?: string;
  };
}
interface PropsForget {
  setForgetpass: (value: boolean) => void;
}
export default function ResetPassword({ setForgetpass }: PropsForget) {
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpID, setOtpID] = useState(""); // from backend after send_otp
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<ResetPasswordResponse>(
        "/user/auth/forget_password",
        { email },
      );
      if (!response.success) {
        throw new Error(response.message || "Error sending OTP.");
      }
      return response;
    },
    onSuccess: (response) => {
      setOtpSent(true);
      setOtpID(response.data?.otpID ?? "");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Server error"),
  });
  const resetPasswordMutation = useMutation({
    mutationFn: async (bodyData: {
      email: string;
      otp: string;
      otpID: string;
      password: string;
    }) => {
      const response = await apiClient.post<ResetPasswordResponse>(
        "/user/auth/reset_password",
        bodyData,
      );
      if (!response.success || !response.data.user || !response.data.token) {
        throw new Error(response.message || "Unable to reset password.");
      }
      return { user: response.data.user, token: response.data.token };
    },
    onSuccess: ({ user, token }) => {
      dispatch(setAuthToken(token));
      dispatch(setUser(user));
      toast.success("Password reset successful");
      router.push(user.role === "admin" ? "/admin" : "/");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Something went wrong!"),
  });
  const isLoading = sendOtpMutation.isPending || resetPasswordMutation.isPending;

  const validateContact = (value: string) => {
    const isEmail = /^\S+@\S+\.\S+$/.test(value);
    return isEmail;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact(contact)) {
      toast.warning("Enter a valid email address.");
      return;
    }

    sendOtpMutation.mutate(contact);
  };

  const handleSetpassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({ email: contact, otp, otpID, password });
  };

  return (
    <div className="flex w-full items-center justify-center">
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>
          <input
            type="email"
            placeholder="Email address"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-cyan-950"
          />
          <Button type="submit" size="xl" className="w-full !py-3 rounded-xl">
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
          <div
            className="text-primary text-sm text-right mt-2 px-4 cursor-pointer hover:text-accent"
            onClick={() => setForgetpass(false)}
          >
            Login
          </div>
        </form>
      ) : (
        <form onSubmit={handleSetpassword} className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Verify OTP & Set Password
          </h2>
          <input
            type="text"
            readOnly
            value={contact}
            placeholder={contact ? contact : "Your email"}
            className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-cyan-950"
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-cyan-950"
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type={showConPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:ring-cyan-950"
            />
            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowConPassword(!showConPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              {showConPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            size="xl"
            className="w-full rounded-xl py-3"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
          <div
            className="text-primary text-sm text-right mt-2 px-4 cursor-pointer hover:text-accent"
            onClick={() => setForgetpass(false)}
          >
            Login
          </div>
        </form>
      )}
    </div>
  );
}
