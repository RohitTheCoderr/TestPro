"use client";

import { useMemo } from "react";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import { ExamDetails, Examresponse, Exams } from "@/Interfaces";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BadgeCheck, BookOpenCheck, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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
        Explore Tests
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
        <div
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          role="status"
          aria-label="Loading exams"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="flex h-40 animate-pulse flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div>
                <div className="mb-3 h-6 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
              </div>
              <div className="h-9 w-full rounded-full bg-muted" />
            </div>
          ))}
        </div>
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

      {examTypes.length > 0 && (
        <section className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] via-background to-secondary/40 px-6 pt-10 sm:px-10 lg:px-14">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-sm font-medium text-primary">
                <BadgeCheck size={16} aria-hidden="true" />
                Your preparation starts here
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Make your next{" "}
                <span className="text-primary">{decodedCategory}</span> exam
                count.
              </h2>
              <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
                Choose a test, challenge yourself, and turn every attempt into
                progress toward your goals.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-foreground sm:text-base">
                <li className="flex items-center gap-3">
                  <BookOpenCheck
                    size={19}
                    className="shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Practice with focused mock tests
                </li>
                <li className="flex items-center gap-3">
                  <TrendingUp
                    size={19}
                    className="shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  Build confidence with every attempt
                </li>
              </ul>
            </div>

            <div className="relative mx-auto flex min-h-64 w-full max-w-md items-end justify-center sm:min-h-80">
              {/* <div
                aria-hidden="true"
                className="absolute h-56 w-56 rounded-full border border-primary/15 sm:h-72 sm:w-72"
              />
              <div
                aria-hidden="true"
                className="absolute h-44 w-44 rounded-full border border-primary/10 sm:h-56 sm:w-56"
              /> */}
              <Image
                src="/boy.png"
                alt="Students preparing for exams together"
                width={520}
                height={420}
                className="relative z-10 w-full max-w-sm object-contain"
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
