"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCurrentExam } from "@/lib/redux/slices/examdetailsSlice";
import type { Exam } from "@/lib/redux/slices/examdetailsSlice.ts";

type ExamDetails = {
  details: string[];
};


interface Examtype {
  name: string;
  slug: string;
  ExamID: string;
  categoryID: string;
  examDetails?: {
    details: string[];
  };
}
interface Examtype {
  name: string;
  slug: string;
  ExamID: string;
  categoryID: string;
  examDetails?: {
    details: string[];
  };
}


type TestCardProps = {
  categoryID: string;
  categoryName: string;
  name: string;
  slug: string;
  examDetails: ExamDetails;
  ExamID: string;
  onSelect: any;
  // onSelect: (id: string) => void;
};

const TestCard: React.FC<TestCardProps> = ({
  categoryID,
  categoryName,
  name,
  slug,
  examDetails,
  ExamID,
  onSelect,
}) => (
  <div className="rounded-2xl border border-border shadow-sm p-6 flex flex-col justify-between bg-card hover:shadow-md transition">
    <div>
      <h3 className="text-xl font-semibold text-foreground">{name}</h3>
      {examDetails.details.length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {examDetails.details[0]}
        </p>
      )}
    </div>
    <div className="mt-4 flex gap-4">
      <Link
        href={`/tests/${categoryName}/${slug}`}
        className="w-full text-center px-4 py-2 bg-primary text-white rounded-full hover:bg-accent hover:text-accent-foreground text-sm transition"
        onClick={() =>
          onSelect({
            ExamID,
            name,
            slug,
            categoryID,
            categoryName,
            examDetails,
          })
        } // ✅ pass full exam object
      >
        Explore {name} Tests
      </Link>
    </div>
  </div>
);

export default function TestsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // unwrap promise
  const { category } = use(params);
  const dispatch = useDispatch();
  const [examTypes, setExamTypes] = useState<TestCardProps[]>([]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await apiClient.get(`/category/${category}/exams`);
        const categoryName = res.data.category.name;
        const exams: TestCardProps[] = res.data.exams.map((exam: Examtype) => ({
          name: exam.name,
          slug: exam.slug,
          ExamID: exam.ExamID,
          categoryName: categoryName,
          categoryID: exam.categoryID,
          examDetails: exam.examDetails || { details: [] },
        }));

        setExamTypes(exams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    if (category) fetchExamData();
  }, [category]);

 
  const handleExamSelect = (exam: Exam) => {
    dispatch(setCurrentExam(exam));
  };

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-foreground ">
          Select Your{" "}
          <span className="font-bold text-primary uppercase">{category}</span>{" "}
          Categories
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Improve your skills by taking practice tests designed for students and
          job seekers.
        </p>
      </div>
      {examTypes.length !== 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {examTypes.map((exam) => (
            <TestCard key={exam.ExamID} {...exam} onSelect={handleExamSelect} />
          ))}
        </div>
      ) : (
        <p className="text-center font-bold text-xl my-12 text-red-500 ">
          Now, No any categories(test) in{" "}
          <span className="font-bold text-primary uppercase">{category}</span>{" "}
        </p>
      )}

      <div className="mt-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground">
          Ready to challenge yourself?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Start with a free test or explore more paid mock tests for in-depth
          practice.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg">Start Free Test</Button>
          <Button variant="outline" size="lg">
            Explore More Tests
          </Button>
        </div>
      </div>
    </main>
  );
}
