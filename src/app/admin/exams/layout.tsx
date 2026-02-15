"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { apiClient } from "@/lib/API/apiClient";
import { Examresponse } from "@/Interfaces";

interface Exam {
  ExamID: string;
  name: string;
  slug: string;
  categoryID: string;
  examDetails?: {
    details?: string;
  };
}

function LayoutPage() {
  const categories = useSelector((state: any) => state.category.categories);
  console.log("catrefkf", categories);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [examsByCategory, setExamsByCategory] = useState<
    Record<string, Exam[]>
  >({});
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const fetchExams = async (slug: string) => {
    try {
      setLoading(slug);
      const res = await apiClient.get<Examresponse>(
        `/admin/${categories.categoryID}/exams/list`,
      );

      setExamsByCategory((prev) => ({
        ...prev,
        [slug]: res.data.exams,
      }));

      // auto-select first exam
      if (res?.data?.exams.length > 0) {
        setActiveExam(res.data.exams[0]);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setActiveExam(null);

    if (!examsByCategory[slug]) {
      fetchExams(slug);
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
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories?.map((cat: any) => (
          <button
            key={cat.categoryID}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              activeCategory === cat.slug
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
        <div className="col-span-4 bg-white rounded shadow p-4 overflow-y-auto">
          <h3 className="font-semibold mb-3">Exams</h3>

          {!activeCategory && (
            <p className="text-sm text-gray-500">Select a category</p>
          )}

          {loading === activeCategory && (
            <p className="text-sm text-gray-500">Loading exams...</p>
          )}

          {activeCategory && examsByCategory[activeCategory]?.length === 0 && (
            <p className="text-sm text-gray-500">No exams found</p>
          )}

          <ul className="space-y-2">
            {examsByCategory[activeCategory || ""]?.map((exam) => (
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
        <div className="col-span-8 bg-white rounded shadow p-6">
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

export default LayoutPage;
