"use client";

import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setCurrentTest } from "@/lib/redux/slices/testSlice";

// interface PageProps {
//   params: { category: string; examType: string };
// }

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
  };
};

type TestCardProps = {
  examName: string;
  title: string;
  type: string;
  testID: string;
  duration: number;
  price: number;
  examID: string;
  categoryName: string;
  onSelect: any;
};

const Testcard: React.FC<TestCardProps> = ({
  examName,
  title,
  type,
  duration,
  price,
  testID,
  // examID,
  categoryName,
  onSelect,
}) => (
  <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition">
    <div>
      <h2 className="font-semibold text-lg mb-2 uppercase">{title}</h2>

      {/* Tag */}
      <span
        className={`inline-block mb-3 px-2 py-1 text-xs rounded-full ${
          type === "free"
            ? "bg-green-100 text-green-600"
            : "bg-yellow-100 text-yellow-600"
        }`}
      >
        {type === "free" ? "Free Test" : "Paid Test"}
      </span>

      {/* Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>⏱ {duration} mins</p>
        <p>₹ {price} </p>
      </div>
    </div>

    {/* Button */}
    <Link
      href={`/tests/${categoryName}/${examName}/${title}`}
      onClick={() => onSelect(testID)}
      className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition w-full text-center"
    >
      View Details
    </Link>
  </div>
);

export default function ExamTypeTests({
  params,
}: {
  params: Promise<{ category: string; examType: string }>;
}) {
  const { category, examType } = use(params);

  const [examList, setExamList] = useState<TestCardProps[]>([]);

  const currentExam = useSelector(
    (state: RootState) => state.exam.currentExam
  ) as ExamDetails | null;

  const dispatch = useDispatch();
  const handleTestSelect = (testID: string) => {
    dispatch(setCurrentTest(testID));
  };

  useEffect(() => {
    const fetchAllExams = async () => {
      try {
        const res = await apiClient.get(`/user/tests/${currentExam?.ExamID}`);
        const exams: TestCardProps[] = res.tests.map((exam: any) => ({
          title: exam.title,
          type: exam.type,
          duration: exam.duration,
          price: exam.price,
          testID: exam.testID,
          examID: exam.examID,
          categoryName: category,
          examName: currentExam?.name,
        }));
        setExamList(exams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchAllExams();
  }, [examType]);

  return (
    <div className="p-6 md:p-10 mx-auto min-h-screen bg-background text-foreground">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">
        <span className="uppercase">{category} </span>→ {examType} Tests
      </h1>

      {/* Grid of Tests */}
      {examList.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {examList.map((test) => (
            <Testcard key={test.testID} {...test} onSelect={handleTestSelect} />
          ))}
        </div>
      ) : (
        <p className="text-center capitalize text-xl font-semibold text-red-500">
          No tests found for this category.
        </p>
      )}
    </div>
  );
}
