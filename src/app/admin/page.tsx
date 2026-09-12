import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Plus, Tags } from "lucide-react";

function AdminPage() {
  return (
    <div className="min-h-screen space-y-8 p-2 text-slate-900 dark:text-white md:p-4">
      <div className="rounded-2xl bg-[#123b43] p-6 text-white shadow-lg md:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
          TestPro operations
        </p>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Admin overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/75">
              Manage the learning catalogue, publish tests, and keep the student
              experience moving.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-cyan-200/40 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 md:self-auto"
          >
            View user site <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Workspace</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Jump directly into the areas you manage most.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/categories"
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                <Tags size={21} />
              </span>
              <ArrowRight
                className="text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </div>
            <h3 className="font-semibold">Categories</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Organize the subjects students use to find practice content.
            </p>
          </Link>
          <Link
            href="/admin/exams"
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <FileText size={21} />
              </span>
              <ArrowRight
                className="text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </div>
            <h3 className="font-semibold">Exams</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create exam structures, review details, and connect tests.
            </p>
          </Link>
          <Link
            href="/admin/tests"
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <ClipboardList size={21} />
              </span>
              <ArrowRight
                className="text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </div>
            <h3 className="font-semibold">Tests and questions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Build question sets and keep every test ready to publish.
            </p>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-bold">Recommended workflow</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <span className="text-2xl font-bold text-primary">01</span>
              <p className="mt-2 text-sm font-semibold">Create a category</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Give students a clear starting point.
              </p>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary">02</span>
              <p className="mt-2 text-sm font-semibold">Add an exam</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Set marks, timing, and instructions.
              </p>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary">03</span>
              <p className="mt-2 text-sm font-semibold">Publish tests</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Fill each exam with useful questions.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="font-bold">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/admin/categories/create"
              className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold transition hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Plus size={17} className="text-primary" /> Add category
            </Link>
            <Link
              href="/admin/exams/create"
              className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold transition hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Plus size={17} className="text-primary" /> Add exam
            </Link>
            <Link
              href="/admin/tests/create"
              className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold transition hover:bg-cyan-50 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Plus size={17} className="text-primary" /> Add test
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
