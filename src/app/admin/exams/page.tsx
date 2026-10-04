"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/API/apiClient";
import { Category, CategoryResponse, Examresponse, Exams } from "@/Interfaces";
import Link from "next/link";
import { toast } from "sonner";
import InputField from "@/components/shared/inputField";
import TextAreaField from "@/components/shared/textareaField";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

function ExamsPage() {
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories", { status: true }],
    queryFn: async () => {
      const response = await apiClient.get<CategoryResponse>(
        "/admin/category/list",
        { status: true },
      );
      return response.data?.categories ?? [];
    },
  });
  const [activeCategory, setActiveCategory] = useState<string>();
  const [activeExam, setActiveExam] = useState<Exams | null>(null);
  const {
    data: exams = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["admin-exams", activeCategory],
    enabled: Boolean(activeCategory),
    queryFn: async () => {
      const response = await apiClient.get<Examresponse>(
        `/admin/${activeCategory}/exams/list`,
      );
      return response.data?.exams ?? [];
    },
  });

  useEffect(() => {
    if (categories.length > 0) {
      const firstCategoryId = categories[0].categoryID;
      if (!firstCategoryId) return; // type guard
      setActiveCategory(firstCategoryId);
    }
  }, [categories]);

  useEffect(() => {
    if (!loading && activeCategory) {
      setActiveExam((current) =>
        exams.some((exam) => exam.ExamID === current?.ExamID)
          ? current
          : (exams[0] ?? null),
      );
    }
  }, [activeCategory, exams, loading]);

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load exams.",
      );
    }
  }, [error]);

  const handleCategoryClick = (categoryID: string) => {
    setActiveCategory(categoryID);

    if (!activeExam || activeExam.categoryID !== categoryID) {
      setActiveExam(null);
    }
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Exams</h2>
        <Link
          href="/admin/exams/create"
          className="bg-green-600 text-white max-md:text-[14px] px-4 py-1  md:px-4 md:py-2 rounded hover:bg-green-700"
        >
          + Add Exam
        </Link>
      </div>

      {/* Categories (Top Horizontal) */}
      <div className="flex gap-2 overflow-x-auto scroll-m-4 p-2">
        {categories?.map((cat: Category) => (
          <Button
            variant={activeCategory === cat.categoryID ? "default" : "outline"}
            key={cat.categoryID}
            onClick={() => handleCategoryClick(cat.categoryID)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-4 h-[65vh]">
        {/* LEFT – Exams List */}
        <div className="col-span-3 bg-white dark:bg-zinc-600 rounded shadow p-4 overflow-y-auto">
          <h3 className="font-semibold mb-3">Exams</h3>
          {!activeCategory && (
            <p className="text-sm text-gray-500">Select a category</p>
          )}

          {loading && <p className="text-sm text-gray-500">Loading exams...</p>}

          {!activeCategory && (
            <p className="text-sm text-gray-500">No exams found</p>
          )}

          <div className="space-y-2">
            {exams?.map((exam) => (
              <div
                key={exam.ExamID}
                onClick={() => setActiveExam(exam)}
                className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                  activeExam?.ExamID === exam.ExamID
                    ? "bg-green-100 border-l-4 border-primary"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                }`}
              >
                <div>
                  <p className="font-medium">{exam.name}</p>
                  <p className="text-xs text-gray-500">{exam.slug}</p>
                </div>
                <div
                  className={` rounded-full px-3 py-[.5px] text-xs ${exam.status !== false ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                  {exam.status !== false ? "Active" : "InActive"}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT – Exam Details */}
        <div className="col-span-9 bg-white dark:bg-zinc-800 rounded shadow p-6">
          {!activeExam ? (
            <p className="text-gray-500">Select an exam to view details</p>
          ) : (
            <>
              <div className="flex gap-4 flex-wrap">
                <InputField
                  label="Exam Name:"
                  value={activeExam.name}
                  disabled
                  className="w-auto"
                />

                <InputField
                  label="Exam Permark:"
                  value={activeExam.examDetails?.permark}
                  disabled
                  className="w-[12.7rem]"
                />
                <InputField
                  label="Negative Mark:"
                  value={activeExam.examDetails?.negativeMark}
                  disabled
                  className="w-[12.7rem]"
                />
                <InputField
                  label="Total Question:"
                  value={activeExam.examDetails?.totalQuestion}
                  disabled
                  className="w-[12.7rem]"
                />
                <InputField
                  label="Total Marks:"
                  value={activeExam.examDetails?.totalmarks}
                  disabled
                  className="w-[12.7rem]"
                />
                <TextAreaField
                  label="Exam Other Details:"
                  value={activeExam.examDetails?.otherdetails}
                  disabled
                  className="w-full h-auto"
                />
              </div>
              {activeExam.examDetails?.details && (
                <>
                  {activeExam.examDetails.details.length > 0 ? (
                    <ul className="my-4">
                      {" "}
                      <span>Exam Detials:</span>
                      {activeExam.examDetails.details.map((del, index) => (
                        <li key={index} className="text-gray-500 text-[14px]">
                          {index + 1}: {del}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 mb-6">
                      {activeExam.examDetails.details}
                    </p>
                  )}
                </>
              )}
              <div className="flex gap-3">
                <Link
                  href={`/admin/tests?examID=${activeExam.ExamID}`}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  View Tests
                </Link>
                <Link
                  href={`/admin/exams/edit/${activeExam.ExamID}`}
                  className="border px-4 py-2 rounded"
                >
                  Edit Exam
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamsPage;
