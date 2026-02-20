"use client";

import { use } from "react";
import TestDetailsClient from "@/components/ui/TestDetailsClient/TestDetailsClient";
import ClientGuard from "./clientGuard";

interface PageProps {
  params: Promise<{
    category: string;
    examType: string;
    testId: string;
  }>;
}

export default function TestDetailsPage({ params }: PageProps) {
  const { category, examType, testId } = use(params);

  return (
    <ClientGuard>
      <TestDetailsClient
        category={category}
        examType={examType}
        testId={testId}
      />
    </ClientGuard>
  );
}
