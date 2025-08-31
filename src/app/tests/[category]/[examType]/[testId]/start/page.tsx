// app/tests/[id]/start/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";

export default function StartTestPage() {
  const {category ,examType, testId } = useParams();
  const router = useRouter();

  const handleStart = () => {
    // In real app: enforce full screen & API start call
    router.push(`/tests/${category}/${examType}/${testId}/attempt`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Start Test (ID: {testId})</h1>
      <div className="bg-white border rounded-2xl shadow p-6 space-y-4">
        <p>Please read the rules carefully before starting the test:</p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Total Time: 120 minutes</li>
          <li>Do not refresh or close the window during the test.</li>
          <li>+2 marks for correct, -0.5 marks for wrong answers.</li>
        </ul>
        <button
          onClick={handleStart}
          className="w-full mt-6 px-4 py-3 rounded-xl bg-blue-600 text-white text-lg font-medium hover:bg-blue-700"
        >
          Enter Full Screen & Start Test
        </button>
      </div>
    </div>
  );
}
