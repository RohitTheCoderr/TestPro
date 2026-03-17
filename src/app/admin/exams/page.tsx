"use client";

import React, { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/API/apiClient";
import { Category, Examresponse, Exams } from "@/Interfaces";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { toast } from "sonner";
import InputField from "@/components/shared/inputField";
import TextAreaField from "@/components/shared/textareaField";
import { setExamsList } from "@/lib/redux/slices/forAdminSlice/examsSlice";

function ExamsPage() {
  const categories = useAppSelector((state) => state.category.categories);
  const exams = useAppSelector((state) => state.exams.examsList);
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState<string>();
  // const [examsByCategory, setExamsByCategory] = useState<Exams[]>([]);
  const [activeExam, setActiveExam] = useState<Exams | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExams = useCallback(
    async (categoryID: string) => {
      try {
        setLoading(true);
        const res = await apiClient.get<Examresponse>(
          `/admin/${categoryID}/exams/list`,
        );

        const exams: Exams[] = res?.data?.exams;

        // setExamsByCategory(exams);
        dispatch(setExamsList(exams));

        if (exams.length > 0) {
          setActiveExam(exams[0]);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast.error("Error while fetching exams");
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (categories.length > 0) {
      const firstCategoryId = categories[0].categoryID;
      if (!firstCategoryId) return; // type guard
      setActiveCategory(firstCategoryId);
      fetchExams(firstCategoryId);
    }
  }, [categories, fetchExams]);

  const handleCategoryClick = (categoryID: string) => {
    setActiveCategory(categoryID);

    if (!activeExam || activeExam.categoryID !== categoryID) {
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
        {categories?.map((cat: Category) => (
          <button
            key={cat.categoryID}
            onClick={() => handleCategoryClick(cat.categoryID)}
            className={`px-4 py-2 rounded whitespace-nowrap hover:bg-green-600 hover:text-white ${
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
                    ? "bg-green-100 border-l-4 border-green-600"
                    : "bg-gray-100"
                }`}
              >
                <div>
                  <p className="font-medium">{exam.name}</p>
                  <p className="text-xs text-gray-500">{exam.slug}</p>
                </div>
                <div
                  className={` rounded-full px-3 py-[.5px] text-xs ${exam.status ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                  {exam.status ? "Active" : "InActive"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT – Exam Details */}
        <div className="col-span-9 bg-white rounded shadow p-6">
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
