"use client";
import { Examresponse, CategoryResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowRight, FaBookOpen, FaRegFolderOpen } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../button";

function CategoriesSection() {
  const {
    data: categoriesss = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<CategoryResponse>("/category");
      return response.data?.categories ?? [];
    },
  });

  const [categoryname, setCategoryname] = useState("all");
  const [cateID, setCateID] = useState("all");

  const {
    data: examdata = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exams-by-category", cateID],
    enabled: Boolean(cateID),
    queryFn: async () => {
      const response = await apiClient.get<Examresponse>(
        `/category/${cateID}/exams`,
      );
      return response.data?.exams ?? [];
    },
  });

  return (
    <section id="category" className=" bg-background">
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
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-4">
        {isCategoriesLoading ? (
          Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="h-12 w-28 shrink-0 animate-pulse rounded-2xl bg-muted"
            />
          ))
        ) : categoriesError ? (
          <p className="py-3 text-red-600" role="alert">
            {categoriesError instanceof Error
              ? categoriesError.message
              : "Unable to load categories."}
          </p>
        ) : (
          <>
            <Button
              variant={cateID === "all" ? "default" : "outline"}
              onClick={() => {
                setCategoryname("all");
                setCateID("all");
              }}
              className={`relative px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap font-medium text-sm md:text-base

              ${cateID === "all" ? "" : " hover:text-primary hover:shadow-md"}`}
            >
              <span>All</span>

              {cateID === "all" && (
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/30 animate-pulse" />
              )}
            </Button>
            {categoriesss.map((cat, index) => {
              const active = categoryname === cat.slug;

              return (
                <Button
                  variant={active ? "default" : "outline"}
                  key={cat.categoryID || index}
                  onClick={() => {
                    setCategoryname(cat.slug ?? cat.name);
                    setCateID(cat.categoryID);
                  }}
                  className={`relative px-6 py-3 rounded-2xl border transition-all duration-300 whitespace-nowrap font-medium text-sm md:text-base

              ${active ? "" : " hover:text-primary hover:shadow-md"}`}
                >
                  <span>{cat.name}</span>

                  {active && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/30 animate-pulse" />
                  )}
                </Button>
              );
            })}
          </>
        )}
      </div>

      {/* Exams Grid */}
      <div className="mt-12">
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            role="status"
            aria-label="Loading exams"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-48 animate-pulse rounded-3xl border border-border border-l-4 border-l-primary/30 bg-card p-4"
              >
                <div className="mb-4 h-10 w-10 rounded bg-muted" />
                <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-center text-red-600">
            {error instanceof Error ? error.message : "Unable to load exams."}
          </p>
        ) : examdata.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {examdata.map((exam, index) => (
              <Link
                key={exam.ExamID || index}
                href={{
                  pathname: `/tests/${categoryname}/${exam.slug}`,
                  query: {
                    categoryID: exam.categoryID,
                    examID: exam.ExamID,
                  },
                }}
                className="group relative overflow-hidden rounded-3xl border border-border border-l-4 border-l-primary bg-gradient-to-br from-card via-card to-primary/[0.04] shadow-sm transition-all duration-300 hover:translate-x-1 hover:-translate-y-1 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {/* Glow Effect */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-between p-3">
                  <div>
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <FaBookOpen />
                    </div>

                    <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                      {exam?.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      Explore Exam
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
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
