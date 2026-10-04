"use client";

import { apiClient } from "@/lib/API/apiClient";
import { Examresponse, SingleTestsResponse } from "@/Interfaces";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { MdOutlineNavigateNext } from "react-icons/md";

interface Props {
  category: string;
  examType: string;
  testId: string;
}

export default function TestDetailsClient({
  category,
  examType,
  testId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryID = searchParams.get("categoryID");
  const examID = searchParams.get("examID");
  const testID = searchParams.get("testID");
  const decodedTestName = decodeURIComponent(testId);

  const {
    data: exam,
    isLoading: isLoadingExam,
    error: examError,
  } = useQuery({
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

  const {
    data: test,
    isLoading: isLoadingTest,
    error: testError,
  } = useQuery({
    queryKey: ["test-details", examID, testID],
    enabled: Boolean(examID && testID),
    queryFn: async () => {
      const response = await apiClient.get<SingleTestsResponse>(
        `/user/tests/${examID}/${testID}`,
      );
      if (!response.test) throw new Error("Test not found.");
      return response.test;
    },
  });

  const handleStart = () => {
    router.push(
      `/tests/${category}/${examType}/${testId}/start?${searchParams.toString()}`,
    );
  };

  const error = examError ?? testError;
  if (error) {
    return (
      <div role="alert" className="p-6 text-center text-red-600">
        {error instanceof Error ? error.message : "Unable to load test details."}
      </div>
    );
  }

  if (isLoadingExam || isLoadingTest || !exam || !test) {
    return <div className="p-6 text-center">Loading test details...</div>;
  }

  const examDetails = exam.examDetails;

  return (
    <div className="p-6 md:p-10 mx-auto min-h-screen bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">
        {exam.name} - {decodedTestName}
      </h1>
      <div className="font-bold">
        Test ID:{" "}
        <span className="text-primary font-bold font-mono text-xl">
          {test.testID}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {examDetails?.details.map((item: string, idx: number) => (
          <p key={idx} className="text-sm text-muted-foreground">
            {item}
          </p>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Important Instructions</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>
            Total Questions:{" "}
            <span className="font-bold text-lg">
              {examDetails?.totalQuestion}.
            </span>
          </li>
          <li>Timer will start once you begin.</li>
          <li>Total Marks: {examDetails?.totalmarks}</li>
          <li>
            <span className="text-md font-bold text-green-600">
              +{examDetails?.permark}
            </span>{" "}
            marks for correct,{" "}
            <span className="text-md font-bold text-red-600">
              {examDetails?.negativeMark}
            </span>{" "}
            marks for wrong answers.
          </li>
          <li>Do not refresh or close the window during the test.</li>
          <li>You must attempt the questions in the given order.</li>
          <li>Once submitted, you cannot reattempt the test.</li>
          {examDetails?.otherdetails && (
            <li>
              <span className="text-md font-bold">Other Details:</span>{" "}
              {examDetails.otherdetails}
            </li>
          )}
        </ul>
      </div>
      <div className="flex justify-end w-full">
        <button
          onClick={handleStart}
          className="w-[5rem] sm:w-[10rem] flex justify-center gap-1 items-center mt-6 p-2 sm:px-6 sm:py-3 rounded-xl bg-primary text-primary-foreground text-lg font-medium hover:bg-accent text-white transition"
        >
          Next <MdOutlineNavigateNext className="font-semibold text-2xl" />
        </button>
      </div>
    </div>
  );
}
