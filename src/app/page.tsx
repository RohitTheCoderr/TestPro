"use client";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-16 bg-gradient-to-r from-blue-50 to-white">
        {/* Left Content */}
        <div className="max-w-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Practice Mock Tests. <br />
            <span className="text-blue-600">Improve Every Day.</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Prepare for SSC, Banking, UPSC, and more with real exam-like mock tests. Track your performance and get detailed analysis.
          </p>
          <div className="mt-6 space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">Start Free Test</Button>
            <Button variant="outline">Explore Tests</Button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="mt-10 md:mt-0">
          <img
            src="/studetimg.jpg"
            alt="Mock Test Illustration"
            className="w-[400px] md:w-[500px]"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-8 md:px-16 py-12 bg-gray-50">
        <h3 className="text-2xl font-bold mb-6">Explore Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["SSC", "Banking", "UPSC", "GATE"].map((cat) => (
            <div
              key={cat}
              className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold">{cat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
}
