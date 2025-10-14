"use client";
import { setAuthToken } from "@/lib/redux/slices/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function SignUp() {
  const [contact, setContact] = useState(""); // email or mobile
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpID, setOtpID] = useState(""); // from backend after send_otp

  const dispatch = useDispatch<AppDispatch>();
//  const navigate=useNavigate()
const router=useRouter()


  const validateContact = (value: string) => {
    const isEmail = /^\S+@\S+\.\S+$/.test(value);
    const isMobile = /^\d{10}$/.test(value);
    return isEmail || isMobile;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact(contact)) {
      alert("Enter a valid email or 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    console.log(`+91${contact}`);

    // Determine if contact is email or mobile
    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    const bodyData = isEmail
      ? { email: contact } // send only email
      : { mobile: `+91${contact}` }; // send only mobile

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/send_opt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();

      console.log("data otp", data?.data?.otpID);
      
      if (data.success) {
        setOtpSent(true);
        setOtpID(data?.data?.otpID); // save otpID returned from backend
        // setOtpID(data.otpID); // save otpID returned from backend
      } else {
        alert(data.message || "Error sending OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Determine if contact is email or mobile
    const isEmail = /^\S+@\S+\.\S+$/.test(contact);
    const bodyData = isEmail
      ? { email: contact, otp, otpID, password } // send email
      : { mobile: `+91${contact}`, otp, otpID, password }; // send mobile

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      console.log("registration data",data);
      if (res.ok) {
        dispatch(setAuthToken(data?.data?.token));
        alert("Registration successful");
        // redirect or reset form
        router.push("/")
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
          <input
            type="text"
            placeholder="Email or Mobile"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Verify OTP & Set Password
          </h2>
          <input
            type="text"
            readOnly
            value={contact}
           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
       />
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
       />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-full"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      )}
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignUp() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState("");

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("form data", name, email, password);
//   };

//   return (
//     <div className=" flex items-center justify-center transition-colors duration-300">
//       <form onSubmit={handleSignUp} className="">
//         {/* Heading */}
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
//           Create Your Account ✨
//         </h2>

//         {/* Email */}
//         <input
//           type="name"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//         />
//         {/* Email */}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//         />

//         {/* Password */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mb-4 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//         />

//         {/* Submit Button */}
//         <button
//           type="submit"
//           // disabled={isLoading}
//           className="w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
//         >
//           {isLoading ? "Registering..." : "Register"}
//         </button>

//         {/* Error Message */}
//         {/* {error && <p className="text-red-500 text-sm mt-3">Error: {JSON.stringify(error)}</p>} */}
//       </form>
//     </div>
//   );
// }
