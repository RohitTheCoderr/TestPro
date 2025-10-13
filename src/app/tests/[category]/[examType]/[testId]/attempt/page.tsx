// app/tests/[id]/attempt/page.tsx
"use client";
import { RootState } from "@/lib/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AttemptPage() {
  const [selected, setSelected] = useState<string | null>(null);

  
const testID = useSelector((state: RootState) => state.test.testID);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3 sticky top-0 bg-background border-b py-4 z-10">
        <h1 className="text-xl font-bold">
          Attempting Test <span className="text-primary">(ID: {testID})</span>
        </h1>
        <span className="font-mono text-red-500 text-lg bg-muted px-3 py-1 rounded-lg shadow-sm">
          Time Left: 59:30
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Palette Section */}
        <aside className="col-span-1 border border-border rounded-2xl shadow-sm p-4 bg-card">
          <h2 className="font-semibold mb-3 text-foreground">Question Palette</h2>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }, (_, i) => (
              <button
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-primary inline-block"></span>
              Current Question
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
              Answered
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-gray-400 inline-block"></span>
              Not Visited
            </p>
          </div>
        </aside>

        {/* Question Section */}
        <main className="col-span-1 md:col-span-3 border border-border rounded-2xl shadow-sm p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">
            Q1. What is <span className="font-mono">2 + 2</span>?
          </h2>

          <div className="space-y-3">
            {["1", "2", "3", "4"].map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 transition-colors ${
                  selected === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name="q1"
                  className="h-4 w-4 accent-primary"
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
              Previous
            </button>
            <div className="flex gap-4 items-center">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Save & Mark
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Submit */}
      <footer className="mt-10 flex justify-end">
        <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-colors">
          Submit Test
        </button>
      </footer>
    </div>
  );
}
