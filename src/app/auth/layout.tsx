"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname === "/auth/signup";
  const isForgotPassword =
    pathname === "/auth/forgot-password" || pathname === "/auth/reset-password";
  const isLogin = !isSignup && !isForgotPassword;

  return (
    <main className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden bg-[#f4f8f8] px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl dark:bg-cyan-900/20" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-100/80 blur-3xl dark:bg-amber-900/10" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#123b43] p-10 text-white lg:flex lg:flex-col  xl:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[3rem] border-cyan-300/10" />
          <div className="relative">
            <div className="mb-16 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 font-black text-[#123b43]">
                T
              </div>
              <span className="text-xl font-bold tracking-tight">TestPro</span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Smarter preparation
            </p>
            <h1 className="max-w-sm text-4xl font-bold leading-tight xl:text-5xl">
              Turn practice into progress.
            </h1>
            <p className="mt-6 max-w-sm leading-7 text-cyan-50/75">
              Keep your attempts, results, and exam goals in one focused place.
            </p>
          </div>
          <div className="relative mt-4 space-y-4 text-sm text-cyan-50/85">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="shrink-0 text-cyan-300" />
              Track every attempt
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="shrink-0 text-cyan-300" />
              Learn from your results
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="shrink-0 text-cyan-300" />
              Your account stays protected
            </div>
          </div>
        </section>
        <section className="min-w-0 p-5 sm:p-10 lg:p-14">
          <div className="mb-4 flex items-center justify-between lg:hidden sm:mb-8">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
                T
              </span>{" "}
              TestPro
            </div>
            <ShieldCheck className="text-primary" size={20} />
          </div>
          <div className="mx-auto max-w-md">
            <div className="mb-5 sm:mb-8">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:mb-2 sm:text-sm sm:tracking-[0.18em]">
                Your next score starts here
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {isSignup
                  ? "Create your account"
                  : isForgotPassword
                    ? "Reset your password"
                    : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-400 sm:mt-3 sm:leading-6">
                {isSignup
                  ? "Start building a consistent practice habit."
                  : isForgotPassword
                    ? "We’ll help you get back into your account."
                    : "Sign in to continue your preparation."}
              </p>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <div className="grid grid-cols-3 gap-1.5">
                <Link
                  href="/auth/login"
                  aria-current={isLogin ? "page" : undefined}
                  className={`flex min-h-10 items-center justify-center rounded-xl px-2 py-2 text-center text-xs font-semibold transition-all duration-300 sm:min-h-11 sm:py-2.5 sm:text-sm ${
                    isLogin
                      ? "bg-white text-primary shadow-md ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                  }`}
                >
                  Log in
                </Link>

                <Link
                  href="/auth/signup"
                  aria-current={isSignup ? "page" : undefined}
                  className={`flex min-h-10 items-center justify-center rounded-xl px-2 py-2 text-center text-xs font-semibold transition-all duration-300 sm:min-h-11 sm:py-2.5 sm:text-sm ${
                    isSignup
                      ? "bg-white text-primary shadow-md ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                  }`}
                >
                  Sign up
                </Link>

                <Link
                  href="/auth/forgot-password"
                  aria-current={isForgotPassword ? "page" : undefined}
                  className={`flex min-h-10 items-center justify-center rounded-xl px-1.5 py-2 text-center text-[11px] font-semibold transition-all duration-300 sm:min-h-11 sm:px-2 sm:py-2.5 sm:text-sm ${
                    isForgotPassword
                      ? "bg-white text-primary shadow-md ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                  }`}
                >
                  Forgot password
                </Link>
              </div>
            </div>

            {children}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ArrowRight size={14} /> Secure access to your preparation
              dashboard
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
