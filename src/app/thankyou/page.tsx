"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Home, Trophy } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-card p-10 text-center shadow-xl">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-green-600">
          Test Submitted!
        </h1>

        {/* Description */}
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Your test has been submitted successfully.
          <br />
          Great job completing the exam 🎉
        </p>

        {/* Stats Box */}
        <div className="mt-8 rounded-2xl border bg-muted/40 p-5">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Keep Practicing
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Continue attempting more mock tests to improve your speed, accuracy,
            and confidence.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/tests")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-3 font-semibold transition hover:bg-muted"
          >
            Attempt More Tests
          </button>
        </div>
      </div>
    </div>
  );
}
