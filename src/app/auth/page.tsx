"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUp from "@/components/sections/signup";
import Login from "@/components/sections/login";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden bg-[#f4f8f8] px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-cyan-200/60 blur-3xl dark:bg-cyan-900/20" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-100/80 blur-3xl dark:bg-amber-900/10" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#123b43] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
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
          <div className="relative space-y-4 text-sm text-cyan-50/85">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-cyan-300" /> Track every
              attempt
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-cyan-300" /> Learn from
              your results
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-cyan-300" /> Your account
              stays protected
            </div>
          </div>
        </section>
        <section className="min-w-0 p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
                T
              </span>{" "}
              TestPro
            </div>
            <ShieldCheck className="text-primary" size={20} />
          </div>
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Your next score starts here
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {isLogin
                  ? "Sign in to continue your preparation."
                  : "Start building a consistent practice habit."}
              </p>
            </div>
            <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${isLogin ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500"}`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${!isLogin ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500"}`}
              >
                Sign up
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isLogin ? <Login /> : <SignUp />}
              </motion.div>
            </AnimatePresence>
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
