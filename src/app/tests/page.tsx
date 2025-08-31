"use client";
import * as React from "react";
import { Button } from "@/components/ui/button"; // adjust import path if needed
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 📌 Reusable Card Component
type TestCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  category: string;
  // onClick?: () => void;
};

const TestCard: React.FC<TestCardProps> = ({
  title,
  description,
  buttonLabel,
  category,
  // onClick,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col justify-between bg-white">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="mt-4 flex gap-4">
        {/* <Button size="lg" onClick={onClick}></Button> */}
        <Link
          href={`/tests/${category}/`}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-sm"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
};

// 📌 Tests Page
export default function TestsPage() {

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

  const testscategory = [
    {
      title: "SSC",
      description:
        "Sharpen your logical thinking and problem-solving skills with real exam patterns.",
      buttonLabel: "Start Free Test",
    },
    {
      title: "Railway",
      description:
        "Evaluate your coding, data structures, and algorithm knowledge.",
      buttonLabel: "Take Test",
    },
    {
      title: "Banking",
      description:
        "Prepare for real-world interviews with timed mock interview sessions.",
      buttonLabel: "Try Now",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900">Practice Tests</h1>
        <p className="mt-3 text-lg text-gray-600">
          Improve your skills by taking practice tests designed for students and
          job seekers.
        </p>
      </div>

      {/* Test Cards Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test, idx) => (
          <TestCard
            key={idx}
            title={test.title}
            description={test.description}
            buttonLabel={test.buttonLabel}
            category={test.title}
            // onClick={() => alert(`${test.title} started!`)} // you can link instead
          />
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testscategory.map((test, idx) => (
          <TestCard
            key={idx}
            title={test.title}
            description={test.description}
            buttonLabel={test.buttonLabel}
            category={test.title}
            // onClick={() => alert(`${test.title} started!`)} // you can link instead
          />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Ready to challenge yourself?
        </h2>
        <div className="mt-4 flex justify-center gap-4">
          <Button size="lg">Start Free Test</Button>
          <Button variant="outline" size="lg">
            Explore More Tests
          </Button>
        </div>
      </div>
    </main>
  );
}
