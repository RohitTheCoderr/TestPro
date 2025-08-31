// app/tests/[id]/attempt/page.tsx
"use client";
import { useParams } from "next/navigation";

export default function AttemptPage() {
  const { testId } = useParams();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
        <h1 className="text-xl font-bold">Attempting Test (ID: {testId})</h1>
        <span className="font-mono text-red-600 text-lg">Time Left: 59:30</span>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Palette */}
        <aside className="col-span-1 border rounded-2xl shadow p-4 bg-white h-auto">
          <h2 className="font-semibold mb-3">Question Palette</h2>
          <div className="grid grid-cols-4 max-md:grid-cols-5 gap-2">
            {Array.from({ length: 20 }, (_, i) => (
              <button
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
        {/* Question */}
        <main className="col-span-1 md:col-span-3 border rounded-2xl shadow p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Q1. What is 2 + 2 ? </h2>
          <div className="space-y-3">
            {["1", "2", "3", "4"].map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                <input type="radio" name="q1" className="h-4 w-4" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 bg-gray-300 rounded-lg">
              Previous
            </button>
            <div className="flex gap-4 items-center">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Save
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
