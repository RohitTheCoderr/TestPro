"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";

type ExamDetails = {
  details: string[];
};

type TestCardProps = {
  category: string;
  name: string;
  slug: string;
  examDetails: ExamDetails;
  _id: string;
};

const TestCard: React.FC<TestCardProps> = ({
  category,
  name,
  slug,
  examDetails,
  _id,
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
        href={`/tests/${category}/${slug}`}
        className="w-full text-center px-4 py-2 bg-primary text-white rounded-full hover:bg-accent hover:text-accent-foreground text-sm transition"
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

  const [examTypes, setExamTypes] = useState<TestCardProps[]>([]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await apiClient.get(`/category/${category}/exams`);

        const exams: TestCardProps[] = res.data.exams.map((exam: any) => ({
          category,
          name: exam.name,
          slug: exam.slug,
          _id: exam._id,
          examDetails: exam.examDetails || { details: [] },
        }));

        setExamTypes(exams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    if (category) fetchExamData();
  }, [category]);

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Select Your {category} Tests
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Improve your skills by taking practice tests designed for students and
          job seekers.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {examTypes.map((exam) => (
          <TestCard key={exam._id} {...exam} />
        ))}
      </div>

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
