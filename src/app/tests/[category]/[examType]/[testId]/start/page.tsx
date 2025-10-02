// app/tests/[category]/[examType]/[testId]/start/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";

export default function StartTestPage() {
  const { category, examType, testId } = useParams();
  const router = useRouter();

  const handleStart = () => {
    // In real app: enforce full screen & API start call
    router.push(`/tests/${category}/${examType}/${testId}/attempt`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        {examType?.toString().toUpperCase()} Test – {testId}
      </h1>

      <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-6">
        {/* Overview */}
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-semibold">120 mins</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-lg font-semibold">100</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Max Marks</p>
            <p className="text-lg font-semibold">200</p>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Important Instructions</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Total Time: 120 minutes. Timer will start once you begin.</li>
            <li>Do not refresh or close the window during the test.</li>
            <li>+2 marks for correct, -0.5 marks for wrong answers.</li>
            <li>You must attempt the questions in the given order.</li>
            <li>Once submitted, you cannot reattempt the test.</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="text-sm text-muted-foreground">
          By starting the test, you agree to abide by the rules and regulations. 
          Any violation may lead to disqualification.
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full mt-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-lg font-medium hover:bg-accent hover:text-accent-foreground transition"
        >
          Enter Full Screen & Start Test
        </button>
      </div>
    </div>
  );
}
