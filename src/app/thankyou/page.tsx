"use client";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground mt-0 z-0">
      <h1 className="text-3xl font-bold mb-4 text-primary">Thank You!</h1>
      <p className="text-lg mb-6">Your test has been submitted successfully.</p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-[2px] shadow-md hover:bg-green-600 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
