// app/tests/[category]/[examType]/[testId]/start/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/API/apiClient";
import { Examresponse } from "@/Interfaces";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { toast } from "sonner";

export default function StartTestPage() {
  const { category, examType, testId } = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedMsg, setIsCheckedMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryID = searchParams.get("categoryID");
  const examID = searchParams.get("examID");
  const testID = searchParams.get("testID");
  const { data: exam, isLoading, error } = useQuery({
    queryKey: ["exam-by-id", categoryID, examID],
    enabled: Boolean(categoryID && examID),
    queryFn: async () => {
      const response = await apiClient.get<Examresponse>(
        `/category/${categoryID}/exams`,
      );
      const selectedExam = response.data.exams.find(
        (item) => item.ExamID === examID,
      );
      if (!selectedExam) throw new Error("Exam not found.");
      return selectedExam;
    },
  });
  const examDetails = exam?.examDetails;
  const routeQuery = searchParams.toString();

  const handleStart = () => {
    if (!isChecked) {
      toast.error("Please Accept condition first");
      setIsCheckedMsg("Please accept condition first");
      return;
    }
    // In real app: enforce full screen & API start call
    router.push(
      `/tests/${category}/${examType}/${testId}/attempt?${routeQuery}`,
    );
  };

  const handlePrevious = () => {
    // In real app: enforce full screen & API start call
    router.push(`/tests/${category}/${examType}/${testId}?${routeQuery}`);
  };

  if (isLoading) {
    return <p className="p-6 text-center">Loading exam details...</p>;
  }

  if (error || !exam || !testID) {
    return (
      <div role="alert" className="p-6 text-center text-red-600">
        {error instanceof Error
          ? error.message
          : "Exam or test details are missing. Please select the test again."}
        <div className="mt-4">
          <button
            onClick={() =>
              router.push(
                `/tests/${category}/${examType}${routeQuery ? `?${routeQuery}` : ""}`,
              )
            }
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto bg-background text-foreground">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">
        Test ID: <span className="text-primary font-bold ">{testID}</span>
      </h1>

      <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-6">
        {/* Overview */}
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          {/* <div className="p-4 rounded-[10px] bg-muted dark:bg-gray-700">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-semibold">
              {examDetails?.totalQuestion} mins
            </p>
          </div> */}
          <div className="p-4 rounded-[10px] bg-muted dark:bg-gray-700">
            <p className="text-sm text-muted-foreground"> Total Questions</p>
            <p className="text-lg font-semibold">
              {examDetails?.totalQuestion}
            </p>
          </div>
          <div className="p-4 rounded-[10px] bg-muted dark:bg-gray-700">
            <p className="text-sm text-muted-foreground">Correct Answer</p>
            <p className="text-lg font-semibold">
              + {examDetails?.permark} marks
            </p>
          </div>
          <div className="p-4 rounded-[10px] bg-muted dark:bg-gray-700">
            <p className="text-sm text-muted-foreground">Wrong Answer</p>
            <p className="text-lg font-semibold">
              - {examDetails?.negativeMark} mark
            </p>
          </div>
          <div className="p-4 rounded-[10px] bg-muted dark:bg-gray-700">
            <p className="text-sm text-muted-foreground">Max Marks</p>
            <p className="text-lg font-semibold">{examDetails?.totalmarks}</p>
          </div>
        </div>

        {/* Instructions */}
        {/* <div>
          <h2 className="text-lg font-semibold mb-2">Important Instructions</h2>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Total Time: 120 minutes. Timer will start once you begin.</li>
            <li>Do not refresh or close the window during the test.</li>
            <li>+2 marks for correct, -0.5 marks for wrong answers.</li>
            <li>You must attempt the questions in the given order.</li>
            <li>Once submitted, you cannot reattempt the test.</li>
          </ul>
        </div> */}

        <div className="my-12">
          <h2 className="text-lg font-semibold mb-2">Important Instructions</h2>
          <div className="mt-6 space-y-3 text-base">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Question Status Legend
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
                <span>Current Question</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                <span>Answered</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
                <span>Marked for Review</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-muted dark:bg-slate-700 border border-white/50"></div>
                <span>Not Visited</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-sm text-muted-foreground">
          By starting the test, you agree to abide by the rules and regulations.
          Any violation may lead to disqualification.
        </div>

        <div>
          <label className="flex items-center justify-end gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />

            <span>
              I have read all the instructions and I am ready to start the test.
            </span>
          </label>
          {isCheckedMsg && (
            <div className="text-sm text-red-500 text-end ">{isCheckedMsg}</div>
          )}
        </div>

        <div className="flex justify-end items-center gap-4">
          {/* CTA */}
          <Button variant="secondary" onClick={handlePrevious}>
            <IoArrowBackCircle /> Back
          </Button>
          <Button onClick={handleStart}>Start Test</Button>
        </div>
      </div>
    </div>
  );
}
