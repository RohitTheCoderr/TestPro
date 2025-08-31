// app/tests/[id]/result/page.tsx
"use client";
import { useParams } from "next/navigation";

export default function ResultPage() {
  const { testId } = useParams();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Result for Test (ID: {testId})</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-2xl shadow bg-white text-center">
          <p className="text-lg font-semibold">Score</p>
          <p className="text-3xl font-bold text-green-600">120 / 200</p>
        </div>
        <div className="p-6 border rounded-2xl shadow bg-white text-center">
          <p className="text-lg font-semibold">Accuracy</p>
          <p className="text-3xl font-bold text-blue-600">80%</p>
        </div>
        <div className="p-6 border rounded-2xl shadow bg-white text-center md:col-span-2">
          <p className="text-lg font-semibold">Breakdown</p>
          <p>Correct: 40 | Wrong: 10 | Skipped: 10</p>
        </div>
      </div>
    </div>
  );
}
