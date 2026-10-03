"use client";
import { setAuthToken, setUser } from "@/lib/redux/slices/authSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
interface PropsForget {
  setForgetpass: (value: boolean) => void;
}
export default function ResetPassword({ setForgetpass }: PropsForget) {
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpID, setOtpID] = useState(""); // from backend after send_otp
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

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

    setIsLoading(true);
    const bodyData = { email: contact };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/forget_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        },
      );
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpID(data?.data?.otpID); // save otpID returned from backend
      } else {
        toast.error(data.message || "Error sending OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetpassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const bodyData = { email: contact, otp, otpID, password };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/reset_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        },
      );

      // const res=await apiClient.post("/user/auth/reset_password", bodyData)

      const data = await res.json();
      if (res.ok) {
        const isAdmin = data?.data?.user;
        dispatch(setAuthToken(data?.data?.token));
        dispatch(setUser(isAdmin));

        toast.success("Password reset successful");
        if (isAdmin.role === "admin") {
          router.push("/admin");
        } else {
          // redirect or reset form
          router.push("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("error>>", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
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
