"use-client";
import { apiClient } from "@/lib/API/apiClient";
import { RootState } from "@/lib/redux/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CategoriesSection() {

  interface Exam {
    name: string;
    slug: string;
    category: string;
    // add other fields if they exist
  }
  const [examdata, setExamdata] = useState<Exam[]>([]);

  const [categoryname, setCategoryname] = useState("ssc");

  const categoriesss = useSelector((state: RootState) => state.category.categories) || [];

  useEffect(() => {
    if (categoryname) {
      fetchExamData();
    }
  }, [categoryname]);

  const fetchExamData = async () => {
    try {
      const result = await apiClient.get(`/category/${categoryname}/exams`);
      setExamdata(result?.data?.exams);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <section id="#category" className="px-8 md:px-16 py-12  bg-background">
      <h3 className="text-2xl font-bold mb-6">Explore Categories</h3>
      <div className="flex overflow-x-scroll no-scrollbar gap-6 p-4 bg-muted rounded-full">
        {categoriesss.map((cat, index) => (
          <div
            key={cat._id || index}
            className={` border border-border bg-card cursor-pointer shadow rounded-full p-4 min-w-[10rem] w-auto text-center hover:shadow-lg hover:border-primary group transition ${
              categoryname == cat.slug ? "bg-primary shadow-lg text-white" : ""
            }`}
            onClick={() => {
              setCategoryname(cat?.slug);
            }}
          >
            <p
              className={`text-lg group-hover:text-primary font-semibold   ${
                categoryname == cat.slug ? " group-hover:text-white" : ""
              }`}
            >
              {cat.name}
            </p>
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
                  href={`/tests/${categoryname}/${exam.slug}`}
                  className="rounded-2xl shadow-sm flex justify-between group cursor-pointer items-center border border-border p-4 bg-card hover:shadow-md transition"
                >
                  <div className=" w-[80%] text-xl text-center font-semibold group-hover:text-primary text-foreground">
                    {exam?.name}
                  </div>
                  <div>➡️</div>
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
