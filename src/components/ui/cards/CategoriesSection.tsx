"use-client";
import { Category, Examresponse, Exams } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useAppSelector } from "@/lib/redux/hooks";
import { setCurrentExam } from "@/lib/redux/slices/examdetailsSlice";
import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaArrowsAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";

function CategoriesSection() {
  const [examdata, setExamdata] = useState<Exams[]>([]);
  const dispatch = useDispatch();

  const categoriesss = useAppSelector(
    (state) => state.category.categories,
  ) as Category[];

  const firstCategory = categoriesss[0];

  const [categoryname, setCategoryname] = useState<string | undefined>(
    firstCategory?.slug,
  );
  const [cateID, setCateID] = useState<string | undefined>(
    firstCategory?.categoryID,
  );

  const fetchExamData = useCallback(async () => {
    try {
      const result = await apiClient.get<Examresponse>(
        `/category/${cateID}/exams`,
      );

      setExamdata(result?.data?.exams || []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching Exams:",
          error.response?.data || error.message,
        );
      } else if (error instanceof Error) {
        console.error("Error fetching Exams:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [cateID]); // ✅ stable & correct

  useEffect(() => {
    if (cateID) {
      fetchExamData();
    }
  }, [cateID, fetchExamData]);

  useEffect(() => {
    if (!cateID && categoriesss.length > 0) {
      setCategoryname(categoriesss[0].slug);
      setCateID(categoriesss[0].categoryID);
    }
  }, [categoriesss, cateID]);

  const handleExamSelect = (exam: Exams) => {
    dispatch(setCurrentExam(exam));
  };

  return (
    <section id="#category" className=" py-12  bg-background">
      <h3 className="text-2xl font-bold mb-6">Explore Categories</h3>
      <div className="flex overflow-x-scroll no-scrollbar gap-6 p-4 bg-muted rounded-full">
        {categoriesss.map((cat, index) => (
          <div
            key={cat.categoryID || index}
            className={` border border-border bg-card cursor-pointer shadow rounded-full p-4 min-w-[10rem] w-auto my-auto text-center hover:shadow-lg hover:border-primary group transition ${
              categoryname == cat.slug ? "bg-primary shadow-lg text-white" : ""
            }`}
            onClick={() => {
              setCategoryname(cat.slug);
              setCateID(cat.categoryID);
            }}
          >
            {cat.name}
          </div>
        ))}
      </div>
      <div>
        <div>
          <div className="  grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 ">
            {examdata.length !== 0 ? (
              examdata.map((exam, index) => (
                <Link
                  key={index}
                  onClick={() =>
                    handleExamSelect({ ...exam, categoryName: categoryname })
                  }
                  href={`/tests/${categoryname}/${exam.slug}`}
                  className="rounded-2xl shadow-sm flex justify-between group cursor-pointer items-center border border-border p-4 bg-card hover:shadow-md dark:hover:border-white transition"
                >
                  <div className=" w-[80%] text-xl text-center font-semibold group-hover:text-primary text-foreground">
                    {exam?.name}
                  </div>
                  <div>
                    <FaArrowsAlt />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-primary text-center font-bold text-lg">
                NO Exam Avaiable Now
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
