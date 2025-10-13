"use client";
import TestDetailsClient from "@/components/ui/TestDetailsClient/TestDetailsClient";
import { use, } from "react";

interface PageProps {
  params: Promise<{
    category: string;
    examType: string;
    testId: string;
  }>;
}

// Do NOT make this async
export default function TestDetailsPage({
  params,
}: PageProps) {
  const { category, examType, testId } = use(params); // ✅

  return (
    
    <TestDetailsClient
      category={category}
      examType={examType}
      testId={testId}
      // title={title}
    />
  );
}
