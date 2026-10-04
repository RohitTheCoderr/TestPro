"use client";

import { apiClient } from "@/lib/API/apiClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import { TestsResponse } from "@/Interfaces";
import { Test, TestCardProps } from "@/Interfaces/TestInterfaces";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Testcard: React.FC<TestCardProps> = ({
  examName,
  title,
  type,
  duration,
  price,
  testID,
  examID,
  categoryID,
  categoryName,
}) => (
  <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition">
    <div>
      <h2 className="font-semibold text-lg mb-2 uppercase flex justify-between">
        <span>{title}</span>
        <span
          className={`inline-block mb-3 px-2 py-0.5 !text-xs rounded-full ${
            type === "free"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {type === "free" ? "Free" : "Paid"}
        </span>
      </h2>

      {/* Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="flex gap-2">
          <span className="font-semibold text-primary">Duration:</span>⏱{" "}
          {duration} mins
        </p>
        <p className="flex gap-2">
          {" "}
          <span className="font-semibold text-primary">Price:</span>₹
          {price}{" "}
        </p>
      </div>
    </div>

    {/* Button */}
    <Button className="mt-4 ">
      <Link
        href={{
          pathname: `/tests/${categoryName}/${examName}/${title}`,
          query: { categoryID, examID, testID },
        }}
      >
        View Details
      </Link>
    </Button>
  </div>
);

export default function ExamTypeTests({
  params,
}: {
  params: { category: string; examType: string };
}) {
  const { category, examType } = params;

  const decodedCategory = decodeURIComponent(category);
  const decodedExamType = decodeURIComponent(examType);
  const searchParams = useSearchParams();
  const examID = searchParams.get("examID");
  const categoryID = searchParams.get("categoryID");

  const { data: examList = [], isLoading, error } = useQuery({
    queryKey: ["tests-by-exam", examID],
    enabled: Boolean(examID),
    queryFn: async () =>
      (await apiClient.get<TestsResponse>(
        `/user/tests/${examID}`,
      )).tests.map((test) => ({
        title: test.title,
        type: test.type,
        duration: Number(test.duration),
        price: Number(test.price),
        testID: test.testID,
        examID: test.examID,
        categoryID: categoryID ?? undefined,
        categoryName: category,
        examName: decodedExamType,
      })),
  });

  return (
    <div className="px-8 md:px-16 py-12 text-foreground">
      <div className="flex items-start gap-4 mb-6">
        <Button variant="icon" onClick={() => window.history.back()}>
          <ArrowLeft size={16} />
        </Button>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold capitalize leading-tight">
            {decodedExamType}
          </h1>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">
            {decodedCategory}
          </p>
        </div>
      </div>

      {/* Grid of Tests */}
      {isLoading ? (
        <p className="py-12 text-center text-muted-foreground">
          Loading tests...
        </p>
      ) : error ? (
        <p className="py-12 text-center text-red-600">
          {error instanceof Error ? error.message : "Unable to load tests."}
        </p>
      ) : examList.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
          {examList.map((test) => (
            <Testcard key={test.testID} {...test} />
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
