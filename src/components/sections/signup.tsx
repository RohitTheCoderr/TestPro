"use client";
import { setAuthToken, setUser } from "@/lib/redux/slices/authSlice";
// import { AppDispatch } from "@/lib/redux/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/lib/API/apiClient";
import { useMutation } from "@tanstack/react-query";

interface SignupResponse {
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

export default function SignUp() {
  const [contact, setContact] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpID, setOtpID] = useState(""); // from backend after send_otp
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    contact: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // const dispatch = useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  //  const navigate=useNavigate()
  const router = useRouter();
  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<SignupResponse>(
        "/user/auth/send_opt",
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
  const registerMutation = useMutation({
    mutationFn: async (bodyData: {
      email: string;
      otp: string;
      otpID: string;
      password: string;
    }) => {
      const response = await apiClient.post<SignupResponse>(
        "/user/auth/register",
        bodyData,
      );
      if (!response.success || !response.data.user || !response.data.token) {
        throw new Error(response.message || "OTP verification failed.");
      }
      return { user: response.data.user, token: response.data.token };
    },
    onSuccess: ({ user, token }) => {
      dispatch(setAuthToken(token));
      dispatch(setUser(user));
      toast.success("Registration successful");
      router.push(user.role === "admin" ? "/admin" : "/");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Server error"),
  });
  const isLoading = sendOtpMutation.isPending || registerMutation.isPending;

  const validateContact = (value: string) => {
    const isEmail = /^\S+@\S+\.\S+$/.test(value);
    return isEmail;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!name) newErrors.name = "Name is required";
    if (!contact) newErrors.contact = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!otp) newErrors.otp = "OTP is required";

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact(contact)) {
      toast.warning("Enter a valid email address.");
      return;
    }

    sendOtpMutation.mutate(contact);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!name) {
      toast.warning("Please enter your name");
      return;
    }
    if (!contact) {
      toast.warning("Please enter your email");
      return;
    }

    if (!password) {
      toast.warning("Please enter password");
      return;
    }

    if (!otp) {
      toast.warning("Please enter OTP");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    registerMutation.mutate({ email: contact, otp, otpID, password });
  };

  return (
    <div className="flex w-full items-center justify-center">
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Generate OTP</h2>
          <div className="mb-2 ">
            <input
              type="email"
              placeholder="Email address"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`w-full rounded-xl border bg-slate-50 p-3.5 text-sm outline-none transition placeholder:text-slate-400
dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
${
  errors.name
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-primary"
}`}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm ml-2">{errors.contact}</p>
            )}
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            size="xl"
            className="w-full !py-3 rounded-full"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Verify OTP & Set Password
          </h2>
          <div className="mb-2 ">
            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border rounded-full focus:outline-none focus:ring-2 transition
dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
${
  errors.name
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-primary"
}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm ml-2">{errors.name}</p>
            )}
          </div>

          <div className="mb-2">
            <input
              type="text"
              readOnly
              value={contact}
              placeholder={contact ? contact : "Your email"}
              className={`w-full p-3 border rounded-full focus:outline-none focus:ring-2 transition
dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
${
  errors.contact
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-primary"
}`}
            />

            {errors.contact && (
              <p className="text-red-500 text-sm ml-2">{errors.contact}</p>
            )}
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`w-full p-3 border rounded-full focus:outline-none focus:ring-2 transition
dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
${
  errors.otp
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-primary"
}`}
            />

            {errors.otp && (
              <p className="text-red-500 text-sm mb-2">{errors.otp}</p>
            )}
          </div>
          <div className="mb-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-full focus:outline-none focus:ring-2 transition
dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
${
  errors.password
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-primary"
}`}
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
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{errors.password}</p>
            )}
          </div>
          <div className="mb-2">
            <div className="relative ">
              <input
                type={showConPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 border rounded-full focus:outline-none focus:ring-2 transition
dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600
${
  errors.confirmPassword
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-primary"
}`}
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            size="xl"
            className="w-full py-3 rounded-full"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      )}
    </div>
  );
}
