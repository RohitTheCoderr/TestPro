// app/tests/[category]/[examType]/[testId]/start/page.tsx
"use client";

import { RootState } from "@/lib/redux/store";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

interface ExamDetails {
  details: string[];
  negativeMark: number;
  permark: number;
  totalQuestion: number;
  totalmarks: number;
  otherdetails?: string;
}

export default function StartTestPage() {
  const { category, examType, testId } = useParams();
  const router = useRouter();
  const currentExamdetails = useSelector(
    (state: RootState) => state.exam.currentExam
  ) as ExamDetails | null;

  const { negativeMark, permark, totalQuestion, totalmarks } = {
    ...currentExamdetails,
  };


  
const decodedTestName= decodeURIComponent(testId as string);

  const handleStart = () => {
    // In real app: enforce full screen & API start call
    router.push(`/tests/${category}/${examType}/${testId}/attempt`);
  };

  const handlePrevious = () => {
    // In real app: enforce full screen & API start call
    router.push(`/tests/${category}/${examType}/${testId}`);
  };

const testID = useSelector((state: RootState) => state.test.testID);

  return (
    <div className="p-6 w-full mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        Test ID: <span className="text-primary font-bold ">{testID}</span>
      </h1>

      <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-6">
        {/* Overview */}
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-semibold">60 mins</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-lg font-semibold">{totalQuestion}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Correct Answer</p>
            <p className="text-lg font-semibold">{permark}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Wrong Answer</p>
            <p className="text-lg font-semibold">{negativeMark}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Max Marks</p>
            <p className="text-lg font-semibold">{totalmarks}</p>
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
          onClick={handlePrevious}
          // href={{
          //   pathname: `/tests/${category}/${examType}/${testId}`,
          //   query: { title }, // ✅ values to send
          // }}
          className="w-full mt-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-lg font-medium hover:bg-accent hover:text-accent-foreground transition"
        >
          Back
        </button>
        <button
          onClick={handleStart}
          className="w-full mt-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-lg font-medium hover:bg-accent hover:text-accent-foreground transition"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}
