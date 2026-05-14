"use-client";
import { Category, Examresponse, Exams } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useAppSelector } from "@/lib/redux/hooks";
import { setCurrentExam } from "@/lib/redux/slices/examdetailsSlice";
import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaArrowsAlt,
  FaBookOpen,
  FaRegFolderOpen,
} from "react-icons/fa";
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
    <section id="category" className="py-16 bg-background">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Explore Categories
          </h2>
          <p className="text-muted-foreground mt-2">
            Choose your exam category and start practicing
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-4">
        {categoriesss.map((cat, index) => {
          const active = categoryname === cat.slug;

          return (
            <button
              key={cat.categoryID || index}
              onClick={() => {
                setCategoryname(cat.slug);
                setCateID(cat.categoryID);
              }}
              className={`relative px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap font-medium text-sm md:text-base
          
          ${
            active
              ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
              : "bg-card border-border text-foreground hover:border-primary hover:text-primary hover:shadow-md"
          }`}
            >
              <span>{cat.name}</span>

              {active && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/30 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Exams Grid */}
      <div className="mt-12">
        {examdata.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {examdata.map((exam, index) => (
              <Link
                key={index}
                href={`/tests/${categoryname}/${exam.slug}`}
                onClick={() =>
                  handleExamSelect({
                    ...exam,
                    categoryName: categoryname,
                  })
                }
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition">
                      <FaBookOpen />
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                      {exam?.name}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Explore Exam
                    </span>

                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-3xl bg-card">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl mb-4">
              <FaRegFolderOpen />
            </div>

            <h3 className="text-xl font-semibold text-foreground">
              No Exams Available
            </h3>

            <p className="text-muted-foreground mt-2 text-center max-w-md">
              Exams for this category have not been added yet. Please check
              again later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;
