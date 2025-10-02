"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-16 bg-gradient-to-r from-secondary to-background">
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
            <Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              Start Free Test
            </Button>
            <Button className="bg-gray-200 text-black ">Explore Tests</Button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative w-[400px] md:w-[600px] h-[300px] md:h-[400px] mt-10 md:mt-0">
          <Image
            src="/studetimg.jpg"
            alt="Mock Test Illustration"
            fill
            className="object-cover rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-8 md:px-16 py-12 bg-muted">
        <h3 className="text-2xl font-bold mb-6">Explore Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["SSC", "Banking", "UPSC", "GATE"].map((cat) => (
            <div
              key={cat}
              className="bg-card border border-border shadow rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold text-card-foreground">
                {cat}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
