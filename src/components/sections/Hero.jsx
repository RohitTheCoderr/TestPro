"use client";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Welcome to <span className="text-blue-600">MyNextPro</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl">
        Build your next project faster with Next.js, TailwindCSS, and shadcn/ui components.
      </p>
      <div className="mt-6 flex gap-4">
        <Button size="lg">Get Started</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </section>
  );
}
