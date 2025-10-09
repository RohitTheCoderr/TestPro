"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // adjust import path if needed
import Link from "next/link";

// 📌 Reusable Card Component
type TestCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  category: string;
};

const TestCard: React.FC<TestCardProps> = ({
  title,
  description,
  buttonLabel,
  category,
}) => {
  return (
    <div className="rounded-2xl border border-border shadow-md p-6 flex flex-col justify-between bg-card hover:shadow-lg transition-shadow duration-200">
      <div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 flex gap-4">
        <Link
          href={`/tests/${category.toLowerCase()}/`}
          className="px-4 py-2 text-sm rounded-[3px] text-white font-semibold bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
};

// 📌 Tests Page
export default function TestsPage() {

  const [categoriess, setCategoriess]=useState([])

  const tests = [
    {
      title: "Aptitude Test",
      description:
        "Sharpen your logical thinking and problem-solving skills with real exam patterns.",
      buttonLabel: "Start Free Test",
    },
    {
      title: "Technical Test",
      description:
        "Evaluate your coding, data structures, and algorithm knowledge.",
      buttonLabel: "Take Test",
    },
    {
      title: "Mock Interview",
      description:
        "Prepare for real-world interviews with timed mock interview sessions.",
      buttonLabel: "Try Now",
    },
  ];

  const categories = [
    {
      title: "SSC",
      description:
        "Practice mock tests designed for Staff Selection Commission exams.",
      buttonLabel: "Start Free Test",
    },
    {
      title: "Railway",
      description:
        "Boost your chances in Railway exams with subject-specific practice.",
      buttonLabel: "Take Test",
    },
    {
      title: "Banking",
      description:
        "Get ready for IBPS, SBI PO, and other banking competitive exams.",
      buttonLabel: "Try Now",
    },
    {
      title: "Defence",
      description:
        "Ace NDA, CDS, and other defence entrance tests with curated mocks.",
      buttonLabel: "Start Now",
    },
  ];

  useEffect(() => {
    category();
  }, []);

  const category = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify(""),
        }
      );

      const category = await response.json();
      
      console.log("cat", category?.data?.categories);
    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <main className="min-h-screen bg-background py-12 px-6">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-accent dark:text-white">
          Practice Tests
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Improve your skills by taking practice tests designed for students and
          job seekers. Choose from various categories and track your progress.
        </p>
      </div>

      {/* Popular Tests */}
      <section className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Popular Tests
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test, idx) => (
            <TestCard
              key={idx}
              title={test.title}
              description={test.description}
              buttonLabel={test.buttonLabel}
              category={test.title}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Explore by Category
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, idx) => (
            <TestCard
              key={idx}
              title={cat.title}
              description={cat.description}
              buttonLabel={cat.buttonLabel}
              category={cat.title}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-10 max-w-5xl mx-auto shadow-lg">
        {/* <section className="mt-20 text-center bg-gradient-to-r from-blue-300 to-blue-400 rounded-2xl p-10 max-w-5xl mx-auto shadow-lg"> */}
        <h2 className="text-3xl font-bold text-white">
          Ready to challenge yourself?
        </h2>
        <p className="mt-2 text-lg text-primary-foreground/90">
          Start your first free test today and climb up the leaderboard.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-muted"
          >
            Start Free Test
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-primary-foreground text-secondary hover:bg-background hover:text-foreground"
          >
            Explore More Tests
          </Button>
        </div>
      </section>
    </main>
  );
}
