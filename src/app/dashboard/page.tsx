"use client";

import { apiClient } from "@/lib/API/apiClient";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// 🧩 Define updated TypeScript interfaces
interface SubjectWiseResult {
  subjectID: string;
  subjectName: string;
  totalQuestions: number; // ✅ total questions in subject
  attempted: number; // ✅ attempted by user
  correct: number;
  wrong: number;
  percentage: string;
}

interface TestResult {
  testID: string;
  testTitle: string;
  totalScore: number;
  submittedAt: string;
  subjectWiseResult: SubjectWiseResult[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TestResult[];
}

export default function DashboardPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  // const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [viewType, setViewType] = useState<"bar" | "circular">("bar");

  const selectedTest = testResults[selectedIndex];
  // ✅ Fetch test data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get<ApiResponse>("/user/tests/testsresult");
        console.log("Fetched Data:", res);

        if (res?.success && Array.isArray(res.data)) {
          setTestResults(res.data);
          if (res.data.length > 0) setSelectedIndex(0); // default to first test
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        console.error("Error fetching test results:", message);
        alert(message);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle card click
  // const handleTestClick = (index: Number) => {
  //   const found = testResults.find((t) => t.testID === testID);
  //   if (found) setSelectedTest(found);
  // };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="container mx-auto flex-1 px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-card shadow-lg">
          <h1 className="mb-2 text-4xl font-bold lg:text-5xl">
            Welcome back, User!
          </h1>
          <p className="text-base leading-relaxed text-card-foreground">
            Your personalized dashboard to track progress and stay ahead.
          </p>
        </div>

        {/* ✅ All Test Cards */}
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Your Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground">
              Loading or no tests found...
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`cursor-pointer rounded-lg  border p-5 transition-all hover:shadow-md ${
                    selectedIndex === index
                      ? "border-primary bg-primary/10 bg-card"
                      : "border-border"
                  }`}
                >
                  <h3 className="text-lg font-bold">{test.testTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Total Score:{" "}
                    <span className="font-medium">{test.totalScore}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(test.submittedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Subject-wise Graph */}
        {selectedTest && (
          <div className="">
            <div className="flex justify-between items-center">
              <h2 className="mb-4 text-2xl font-semibold">
                Subject Performance – {selectedTest.testTitle}
              </h2>
              <div className="flex gap-3 mb-4">
                <button
                  className={`px-4 py-2 rounded-md text-white ${
                    viewType === "bar" ? "bg-blue-600" : "bg-gray-400"
                  }`}
                  onClick={() => setViewType("bar")}
                >
                  Bar Chart
                </button>

                <button
                  className={`px-4 py-2 rounded-md text-white ${
                    viewType === "circular" ? "bg-blue-600" : "bg-gray-400"
                  }`}
                  onClick={() => setViewType("circular")}
                >
                  Circular Chart
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {selectedTest.subjectWiseResult.map((sub) => (
                <div
                  key={sub.subjectID}
                  className="rounded-lg border border-border bg-card p-4 shadow-md"
                >
                  <h3 className="mb-3 text-lg font-semibold">
                    {sub.subjectName}
                  </h3>
                  {viewType === "bar" ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={[
                          {
                            name: sub.subjectName,
                            Total: sub.totalQuestions,
                            Attempted: sub.attempted,
                            Correct: sub.correct,
                            Wrong: sub.wrong,
                            Accuracy: parseFloat(sub.percentage),
                          },
                        ]}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        {/* <Tooltip /> */}
                        <Legend />
                        <Bar dataKey="Total" fill="#a3a3a3" />
                        <Bar dataKey="Attempted" fill="#f59e0b" />
                        <Bar dataKey="Correct" fill="#10b981" />
                        <Bar dataKey="Wrong" fill="#ef4444" />
                        <Bar dataKey="Accuracy" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Total", value: sub.totalQuestions },
                            { name: "Correct", value: sub.correct },
                            { name: "Attempted", value: sub.attempted },
                            { name: "Wrong", value: sub.wrong },
                            {
                              name: "Accuracy",
                              value: parseFloat(sub.percentage),
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label
                        >
                          <Cell fill="#a3a3a3" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#ef4444" />
                          <Cell fill="#3b82f6" />
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
