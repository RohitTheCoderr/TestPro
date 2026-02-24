"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/API/apiClient";
import { Examresponse, Exams } from "@/Interfaces";
import { useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { toast } from "sonner";

function ExamsPage() {
  const categories = useAppSelector((state) => state.category.categories);

  const [activeCategory, setActiveCategory] = useState<string>();
  const [examsByCategory, setExamsByCategory] = useState<Exams[]>([]);
  const [activeExam, setActiveExam] = useState<Exams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExams = async (categoryID: string) => {
    try {
      setLoading(true);
      const res = await apiClient.get<Examresponse>(
        `/admin/${categoryID}/exams/list`,
      );

      const exams: Exams[] = res?.data?.exams;
      setExamsByCategory(exams);

      if (exams.length > 0) {
        setActiveExam(exams[0]);
      }
    } catch (error) {
      //   console.error("Error fetching exams:", error);
      toast.error("Error while fetching exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      const firstCategoryId = categories[0].categoryID;
      if (!firstCategoryId) return; // type guard
      setActiveCategory(firstCategoryId);
      fetchExams(firstCategoryId);
    }
  }, [categories]);

  const handleCategoryClick = (categoryID: string) => {
    setActiveCategory(categoryID);

    if (activeExam?.categoryID !== categoryID) {
      setActiveExam(null);
      fetchExams(categoryID);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Exams</h2>
        <Link
          href="/admin/exams/create"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Exam
        </Link>
      </div>

      {/* Categories (Top Horizontal) */}
      <div className="flex gap-2 overflow-x-auto scroll-m-4 pb-2">
        {categories?.map((cat: any) => (
          <button
            key={cat.categoryID}
            onClick={() => handleCategoryClick(cat.categoryID)}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              activeCategory === cat.categoryID
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-4 h-[65vh]">
        {/* LEFT – Exams List */}
        <div className="col-span-3 bg-white rounded shadow p-4 overflow-y-auto">
          <h3 className="font-semibold mb-3">Exams</h3>

          {!activeCategory && (
            <p className="text-sm text-gray-500">Select a category</p>
          )}

          {loading && <p className="text-sm text-gray-500">Loading exams...</p>}

          {activeCategory && (
            <p className="text-sm text-gray-500">No exams found</p>
          )}

          <ul className="space-y-2">
            {examsByCategory?.map((exam) => (
              <li
                key={exam.ExamID}
                onClick={() => setActiveExam(exam)}
                className={`p-3 rounded cursor-pointer ${
                  activeExam?.ExamID === exam.ExamID
                    ? "bg-green-100 border-l-4 border-green-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="font-medium">{exam.name}</p>
                <p className="text-xs text-gray-500">{exam.slug}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT – Exam Details */}
        <div className="col-span-9 bg-white rounded shadow p-6">
          {!activeExam ? (
            <p className="text-gray-500">Select an exam to view details</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">{activeExam.name}</h2>

              {activeExam.examDetails?.details && (
                <p className="text-gray-700 mb-6">
                  {activeExam.examDetails.details}
                </p>
              )}

              <div className="flex gap-3">
                <Link
                  href={`/admin/tests?exam=${activeExam.ExamID}`}
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
