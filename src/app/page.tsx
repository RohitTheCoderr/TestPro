"use client";
import { Button } from "@/components/ui/button";
import CategoriesSection from "@/components/ui/cards/CategoriesSection";
import { apiClient } from "@/lib/API/apiClient";
import { setCategories } from "@/lib/redux/slices/categorySlice";
import { AppDispatch } from "@/lib/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.get("/category");
        dispatch(setCategories(data?.data?.categories));
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        alert(error.message);
        setError(error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-around px-8 md:px-16 py-6 bg-gradient-to-r from-secondary to-background">
        {/* Left Content */}
        <div className="max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Practice Mock Tests. <br />
            <span className="text-primary">Improve Every Day.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Prepare for SSC, Banking, UPSC, and more with real exam-like mock
            tests. Track your performance and get detailed analysis.
          </p>
          <div className="mt-6 space-x-4">
            <Button
              href="/tests"
              className="bg-primary w-[10rem] text-lg hover:bg-accent text-white "
            >
              Start Free Test
            </Button>
            <Button
              href={"#category"}
              className="bg-gray-100 w-[10rem] text-lg border border-primary text-black hover:text-white "
            >
              Explore Tests
            </Button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative w-[400px] md:w-[530px] h-[400px] mt-10 md:mt-0">
          <Image
            src="/hero1.png"
            alt="Mock Test Illustration"
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </section>

      {/* Categories Section */}
      {error ? (
        <div className="text-red-600 text-center my-6 p-3 rounded">
          ⚠️ {error}
        </div>
      ) : (
        <CategoriesSection />
      )}
    </div>
  );
}
