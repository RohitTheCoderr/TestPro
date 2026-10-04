"use client";
import { Category, Examresponse, Exams, CategoryResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowRight, FaBookOpen, FaRegFolderOpen } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../button";

function CategoriesSection() {
  const { data: categoriesss = [] } = useQuery({
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
        <Button
          variant={cateID === "all" ? "default" : "outline"}
          key={"all"}
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
      </div>

      {/* Exams Grid */}
      <div className="mt-12">
        {isLoading ? (
          <p className="py-12 text-center text-muted-foreground">
            Loading exams...
          </p>
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
                className="group relative overflow-hidden rounded-3xl border border-border bg-card  transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

                {/* Content */}
                <div className="relative p-4 z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center mb-3 text-2xl group-hover:scale-110 transition">
                      <FaBookOpen />
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                      {exam?.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
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
