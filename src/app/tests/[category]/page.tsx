"use client";

import { useMemo } from "react";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import { ExamDetails, Examresponse, Exams } from "@/Interfaces";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Props for TestCard
type ExamCardProps = {
  categoryID: string;
  categoryName: string;
  name: string;
  slug: string;
  examDetails: ExamDetails;
  ExamID: string;
};

const TestCard: React.FC<ExamCardProps> = ({
  categoryID,
  categoryName,
  name,
  slug,
  examDetails,
  ExamID,
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
    <Button className="mt-4 flex gap-4">
      <Link
        href={{
          pathname: `/tests/${categoryName}/${slug}`,
          query: { categoryID, examID: ExamID },
        }}
        className="w-full text-center px-4 py-2 text-white rounded-full hover:bg-primary/80 hover:text-accent-foreground text-sm transition"
      >
        Explore {name} Tests
      </Link>
    </Button>
  </div>
);

export default function TestsPage({
  params,
}: {
  params: { category: string };
}) {
  // unwrap promise
  const { category } = params;
  const router = useRouter();
  const decodedCategory = decodeURIComponent(category);

  const searchParams = useSearchParams();
  const categoryID = searchParams.get("categoryID") ?? "all";
  const {
    data: examResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exams-by-category", categoryID],
    queryFn: () => apiClient.get<Examresponse>(`/category/${categoryID}/exams`),
  });
  const examTypes = useMemo(() => {
    const categoryName = examResponse?.data?.category?.name;
    return (examResponse?.data?.exams ?? []).map((exam: Exams) => ({
      name: exam.name,
      slug: exam.slug,
      ExamID: exam.ExamID,
      categoryName: categoryName ?? decodedCategory,
      categoryID: exam.categoryID,
      examDetails: exam.examDetails || { details: [] },
    }));
  }, [decodedCategory, examResponse]);

  return (
    <main className=" px-8 md:px-16 py-12">
      {/* Header */}
      <div className="w-full">
        {/* Header */}
        <div className="relative mb-6 flex items-center">
          {/* Back */}
          <Button
            type="button"
            variant="icon"
            onClick={() => window.history.back()}
            className="gap-1.5 rounded-[5px] px-2  hover:text-primary"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>

          {/* Heading */}
          <div className="w-full text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              <span className="text-primary capitalize">{decodedCategory}</span>{" "}
              Exams
            </h1>
          </div>
        </div>

        {/* Description */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm leading-6 text-muted-foreground sm:text-base md:text-lg">
            Sharpen your skills with practice tests designed specifically for{" "}
            <span className="font-semibold text-foreground">
              {decodedCategory}
            </span>
            . Test your knowledge, identify your strengths, and build confidence
            for your exam.
          </p>
        </div>
      </div>

      {/* Exam Cards */}
      {isLoading ? (
        <p className="mt-12 text-center text-muted-foreground">
          Loading exams...
        </p>
      ) : error ? (
        <p className="mt-12 text-center text-red-600">
          {error instanceof Error ? error.message : "Unable to load exams."}
        </p>
      ) : examTypes.length !== 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
          {examTypes.map((exam) => (
            <TestCard key={exam.ExamID} {...exam} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-20 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto text-center">
          <svg
            className="w-24 h-24 text-gray-400 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-4 2h8m-4-4v4"
            />
          </svg>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">
            No Exams Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Currently, there are no exams available in{" "}
            <span className="font-semibold text-primary uppercase">
              {decodedCategory}
            </span>
            .
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You can explore other categories or check back later for updates.
          </p>
          <Button
            onClick={() => router.push("/tests")}
            variant="secondary"
            className="mt-4 px-8 py-3 shadow-lg "
          >
            Explore Other Categories
          </Button>
        </div>
      )}

      {/* Optional CTA Section */}
      <div className="mt-20 text-center max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl max-sm:p-5 p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          Ready to challenge yourself?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Start with a free test or explore more paid mock tests for in-depth
          practice.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="px-6 py-3 font-semibold shadow"
            variant="secondary"
            onClick={() => router.push("/tests")}
          >
            Start Free Test
          </Button>
          <Button
            className="px-6 py-3 font-semibold shadow"
            variant="outline"
            onClick={() => router.push("/tests")}
          >
            Explore More Tests
          </Button>
        </div>
      </div>
    </main>
  );
}
