import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#f4f8f8] px-4 py-20 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl dark:bg-cyan-900/20" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-900/10" />

      <section className="relative w-full max-w-2xl text-center">
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-cyan-100 bg-white/80 text-primary shadow-lg shadow-cyan-900/5 dark:border-slate-700 dark:bg-slate-900">
          <Compass size={30} strokeWidth={1.7} />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Page not found
        </p>
        <h1 className="mt-3 text-[6.5rem] font-black leading-none tracking-tighter text-slate-900 dark:text-white sm:text-[9rem]">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          This page took a wrong turn.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600 dark:text-slate-400">
          The page you&apos;re looking for may have moved, been removed, or never
          existed. Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white shadow-lg shadow-cyan-900/15 transition hover:-translate-y-0.5 hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50"
        >
          <Home size={18} />
          Go to Home
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <p className="mt-8 text-xs font-medium tracking-wide text-slate-400">
          TESTPRO <span className="mx-2">·</span> KEEP LEARNING, KEEP GROWING
        </p>
      </section>
    </main>
  );
}
