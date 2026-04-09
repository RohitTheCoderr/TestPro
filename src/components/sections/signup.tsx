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

export default function SignUp() {
  const [contact, setContact] = useState(""); // email or mobile
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const validateContact = (value: string) => {
    const isEmail = /^\S+@\S+\.\S+$/.test(value);
    const isMobile = /^\d{10}$/.test(value);
    return isEmail || isMobile;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!name) newErrors.name = "Name is required";
    if (!contact) newErrors.contact = "Email or mobile is required";
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
    if (!validateForm()) return;
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/send_opt`,
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!name) {
      toast.warning("Please enter your name");
      return;
    }
    if (!contact) {
      toast.warning("Please enter email or mobile");
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

    setIsLoading(true);
    // Determine if contact is email or mobile
    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    const bodyData = isEmail
      ? { email: contact, otp, otpID, password } // send email
      : { mobile: `+91${contact}`, otp, otpID, password }; // send mobile

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/register`,
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

        toast.success("Registration successful");
        if (isAdmin.role === "admin") {
          router.push("/admin");
        } else {
          // redirect or reset form
          router.push("/");
        }
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("error>>", err);
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {!otpSent ? (
        <form onSubmit={handleSendOtp}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Enter Email or Mobile
          </h2>
          <div className="mb-2 ">
            <input
              type="text"
              placeholder="Email or Mobile"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`w-full p-3 border rounded-full focus:outline-none focus:ring-2 transition
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
              placeholder={contact ? contact : "Your email or mobile"}
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
