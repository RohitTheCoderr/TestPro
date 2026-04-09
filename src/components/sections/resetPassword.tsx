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
  const [contact, setContact] = useState(""); // email or mobile
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
    const isMobile = /^\d{10}$/.test(value);
    return isEmail || isMobile;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact(contact)) {
      toast.warning("Enter a valid email or 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    // Determine if contact is email or mobile
    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    const bodyData = isEmail
      ? { email: contact } // send only email
      : { mobile: `+91${contact}` }; // send only mobile

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
    // Determine if contact is email or mobile
    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    const bodyData = isEmail
      ? { email: contact, otp, otpID, password } // send email
      : { mobile: `+91${contact}`, otp, otpID, password }; // send mobile

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
    <div className="flex items-center justify-center">
      {!otpSent ? (
        <form onSubmit={handleSendOtp}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>
          <input
            type="text"
            placeholder="Email or Mobile"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <Button type="submit" size="xl" className="w-full !py-3 rounded-full">
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
        <form onSubmit={handleSetpassword}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Verify OTP & Set Password
          </h2>
          <input
            type="text"
            readOnly
            value={contact}
            placeholder={contact ? contact : "Your email or mobile"}
            className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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
            className="w-full py-3 rounded-full"
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
