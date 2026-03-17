"use client";
import * as React from "react";
import { Button } from "@/components/ui/button"; // adjust path
import Link from "next/link";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { Category } from "@/Interfaces";
import { useAppSelector } from "@/lib/redux/hooks";

const CategoryCard: React.FC<Category> = ({
  name,
  slug,
  categoryDetails,
  categoryID,
}) => {
  return (
    <div className="rounded-2xl border border-border shadow-md p-6 flex flex-col justify-between bg-card hover:shadow-lg transition-shadow duration-200">
      <div>
        <h3 className="text-xl font-medium text-foreground">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {categoryDetails?.details}
        </p>
      </div>
      {categoryID && (
        <Button className="mt-4 flex gap-4">
          <Link
            // href={`/tests/${slug}/`}
            href={{
              pathname: `/tests/${slug}`,
              query: { categoryID },
            }}
          >
            Explore category
          </Link>
        </Button>
      )}
    </div>
  );
};

// 📌 Tests Page
export default function TestsPage() {
  const tests = [
    {
      name: "Aptitude Test",
      categoryDetails: {
        details:
          "Sharpen your logical thinking and problem-solving skills with real exam patterns.",
      },
    },
    {
      name: "Technical Test",
      categoryDetails: {
        details:
          "Evaluate your coding, data structures, and algorithm knowledge.",
      },
    },
    {
      name: "Mock Interview",
      categoryDetails: {
        details:
          "Prepare for real-world interviews with timed mock interview sessions.",
      },
    },
  ];

  const categoriesss = useAppSelector((state) => state.category.categories);

  return (
    <main className="py-12 px-8 md:px-16  ">
      {/* Hero Section */}
      <div className=" w-full mx-auto text-center">
        <h1 className="text-4xl font-bold text-accent dark:text-white">
          Practice Tests
        </h1>
        <p className="mt-3  text-xs md:text-lg text-muted-foreground">
          Improve your skills by taking practice tests designed for students and
          job seekers. Choose from various categories and track your progress.
        </p>
      </div>

      {/* Popular Tests */}
      <section className="w-full mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-foreground  ">
          Popular Tests
        </h2>
        <div className="bg-primary h-[2px] mt-1 mb-6 w-12"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border shadow-md p-6 flex flex-col justify-between bg-card hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <h3 className="text-xl font-medium text-foreground">
                  {test?.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {test?.categoryDetails?.details}
                </p>
              </div>
              <Button className="mt-4 flex gap-4">
                <Link href={`/tests`}>Explore category</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="w-full mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-foreground ">
          Explore by Category
        </h2>
        <div className="bg-primary h-[2px] mt-1 mb-6 w-12"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.isArray(categoriesss) && categoriesss.length > 0 ? (
            categoriesss.map((cat) => (
              <CategoryCard
                key={cat.categoryID}
                name={cat.name}
                slug={cat.slug}
                categoryID={cat.categoryID}
                categoryDetails={
                  cat?.categoryDetails
                    ? { details: cat?.categoryDetails?.details }
                    : undefined
                }
              />
            ))
          ) : (
            <p className="text-black dark:text-red-500">No categories found</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-5 sm:p-10 max-w-5xl mx-auto shadow-lg">
        <h2 className="text-3xl font-bold text-white">
          Ready to challenge yourself?
        </h2>
        <p className="mt-2 text-lg text-primary-foreground/90 text-gray-300">
          Start your first free test today and climb up the leaderboard.
        </p>
        <div className="mt-6 flex max-sm:flex-col justify-center gap-4">
          <Button size="lg">Start Free Test</Button>
          <Button variant="outline" size="lg">
            Explore More Tests
          </Button>
        </div>
      </section>
    </main>
  );
}
