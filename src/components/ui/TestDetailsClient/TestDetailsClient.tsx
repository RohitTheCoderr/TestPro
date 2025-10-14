"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  category: string;
  examType: string;
  testId: string;
}

type ExamDetails = {
  ExamID: string;
  categoryID: string;
  categoryName: string;
  name: string;
  slug: string;
  examDetails: {
    details: string[];
    negativeMark: number;
    permark: number;
    totalQuestion: number;
    totalmarks: number;
    otherdetails:string
  };
};

export default function TestDetailsClient({
  category,
  examType,
  testId,
}: Props) {
  const router = useRouter();
  const currentExam = useSelector(
    (state: RootState) => state.exam.currentExam
  ) as ExamDetails | null;

  const token = useSelector((state: RootState) => state.auth.token) || "";

  const{name, examDetails,}={...currentExam}

  useEffect(() => {
    if (!token) {
      alert("please login/Register before starting Test");
      router.push("/auth");
    }
    if (!currentExam) router.push(`/tests/${category}`);
  }, [token, currentExam, category, router]);

  if (!currentExam) return <div>Loading...</div>;

  const handleStart = () => {
    // In real app: enforce full screen & API start call
    router.push(`/tests/${category}/${examType}/${testId}/start`);
  };

const decodedTestName= decodeURIComponent(testId as string);
const testID = useSelector((state: RootState) => state.test.testID);

  return (
    <div className="p-6 md:p-10 mx-auto min-h-screen bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">
        {name} - {decodedTestName}
      </h1>
      <div className="font-bold">
        Test ID:{" "}
        <span className="text-primary font-bold font-mono text-xl">
          {testID}
        </span>
      </div>

      {/* Instructions */}
      <div className="mt-4 space-y-2">
        {examDetails?.details.map((item: string, idx: number) => (
          <p key={idx} className="text-sm text-muted-foreground">
            {item}
          </p>
        ))}
      </div>

      {/* Optionally: show other info */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Important Instructions</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>
            Total Questions:{" "}
            <span className="font-bold text-lg">
              {" "}
              {examDetails?.totalQuestion}.{" "}
            </span>
          </li>
          <li> Timer will start once you begin.</li>
          <li>Total Marks: {examDetails?.totalmarks}</li>
          <li>
            {" "}
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
            <p>
              <span className="text-md font-bold">Other Details:</span>{" "}
              {examDetails?.otherdetails}
            </p>
          )}
        </ul>
      </div>
      <div className="flex justify-end w-full">
        <button
          onClick={handleStart}
          className="w-[5rem] sm:w-[10rem] mt-6 p-2 sm:px-6 sm:py-3 rounded-xl bg-primary text-primary-foreground text-lg font-medium hover:bg-accent text-white transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
