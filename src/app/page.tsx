"use client";
import { Button } from "@/components/ui/button";
import CategoriesSection from "@/components/ui/cards/CategoriesSection";
import { Category } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { setCategories } from "@/lib/redux/slices/categorySlice";
import { AppDispatch } from "@/lib/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  MdAnalytics,
  MdTimer,
  MdInsights,
  MdVerifiedUser,
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Define your Category type
// interface Category {
//   categoryID: string;
//   name: string;
//   slug: string;
//   categoryDetails?: {
//     details: string;
//     otherdetails: string;
//   };
// }

// Define the API response structure
interface CategoryResponse {
  data: {
    categories: Category[];
  };
}

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.get<CategoryResponse>("/category");
        console.log("data category", data);

        dispatch(setCategories(data?.data?.categories));
      } catch (error: unknown) {
        let message = "An unexpected error occurred.";

        if (error instanceof Error) {
          message = error.message;
        }

        console.error("Error fetching categories:", message);
        alert(message);
        setError(message);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-around px-8 md:px-16 py-6 bg-gradient-to-r from-secondary to-background">
        {/* Left Content */}
        <div className="max-w-xl">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Practice Mock Tests. <br />
            <span className="text-primary">Improve Every Day.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground drop-shadow-sm">
            Prepare for SSC, Banking, UPSC, and more with real exam-like mock
            tests. Track your performance and get detailed analysis.
          </p>
          <div className="mt-6 sm:space-x-4">
            <Button
              href="/tests"
              className="bg-primary w-full sm:w-[10rem] text-lg hover:bg-accent text-white "
            >
              Start Free Test
            </Button>
            <Button
              href={"#category"}
              className="bg-gray-100 w-full sm:w-[10rem] max-sm:mt-4 text-lg border border-primary text-black hover:text-white "
            >
              Explore Tests
            </Button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative w-[300px] sm:w-[400px] md:w-[530px] h-[300px] sm:h-[400px] mt-10 md:mt-0">
          <Image
            // src="/hero1.png"
            src="/herocartoon.png"
            alt="Mock Test Illustration"
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </section>

      <section className="py-16 px-8 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Why Choose TestPro ?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our platform offers a range of features designed to help you succeed
            in your exams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1️⃣ Feature */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <MdAnalytics size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Comprehensive Test Series
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access a wide variety of mock tests covering all major SSC,
              Banking, and Railway exams.
            </p>
          </div>

          {/* 2️⃣ Feature */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <MdTimer size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Time-Bound Mock Exams
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simulate the actual exam environment with time-bound tests to
              improve your speed and accuracy.
            </p>
          </div>

          {/* 3️⃣ Feature */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <MdInsights size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Performance Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get detailed insights into your performance, including strengths,
              weaknesses, and areas for improvement.
            </p>
          </div>

          {/* 4️⃣ Feature */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center mb-6">
              <MdVerifiedUser size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure and Reliable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our platform ensures a secure and reliable testing experience, so
              you can focus on your preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-8 md:px-16 ">
        <div className="text-center max-w-3xl mx-auto ">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Our Mock Test Categories
          </h2>
          <p className="text-lg text-text-light/70 dark:text-text-dark/70">
            Explore our wide range of mock tests tailored for your specific exam
            needs.
          </p>
        </div>
        {error ? (
          <div className="text-red-600 text-center my-6 p-3 rounded">
            ⚠️ {error}
          </div>
        ) : (
          <CategoriesSection />
        )}
      </section>

      <section className="bg-gradient-to-r from-green-500 to-teal-500 dark:from-gray-900 dark:to-gray-800 text-white rounded-3xl py-20 px-6 md:px-16 my-12  text-center shadow-lg relative overflow-hidden">
        {/* Optional decorative shapes */}
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Start Your Exam Preparation Today
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 drop-shadow">
            Join <span className="font-semibold">TestPro</span> and take the
            first step towards achieving your career goals.
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-4 md:px-8 md:py-5 rounded-xl flex justify-center items-center gap-3 m-auto bg-white text-green-600 font-bold shadow-xl hover:bg-green-50 hover:text-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <span>Sign Up Now & Get a Free Mock Test</span>
            <FaArrowRight className="text-lg" />
          </button>
        </div>
      </section>
    </div>
  );
}
