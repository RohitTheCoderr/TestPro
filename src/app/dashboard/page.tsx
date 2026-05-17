"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/API/apiClient";
import { useAppSelector } from "@/lib/redux/hooks";
import { EyeIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

// 🧩 Define updated TypeScript interfaces
interface SubjectWiseResult {
  subjectID: string;
  subjectName: string;
  totalQuestions: number; // total questions in subject
  attempted: number; // attempted by user
  correct: number;
  wrong: number;
  percentage: string;
  marksGained: number;
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
  const [load, setLoad] = useState<boolean>(false);
  const selectedTest = testResults[selectedIndex];

  const user = useAppSelector((state) => state.auth.user) || null;
  // ✅ Fetch test data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const res = await apiClient.get<ApiResponse>("/user/tests/testsresult");
        if (res?.success && Array.isArray(res.data)) {
          setTestResults(res.data);
          setLoad(false);
          if (res.data.length > 0) setSelectedIndex(0); // default to first test
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        toast.error(message);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="container mx-auto flex-1 px-4 py-8 ">
        {/* Header */}
        <div className="mb-8 rounded-full bg-gradient-to-r text-center from-primary to-accent p-2 sm:p-8 text-card shadow-lg">
          <h1 className="mb-2 text-xl sm:text-4xl font-bold lg:text-5xl">
            Welcome back {user?.name}
          </h1>
          <p className="text-xs sm:text-base leading-relaxed text-gray-400">
            Your personalized dashboard to track progress and stay ahead.
          </p>
        </div>

        <div className="mb-10">
          {load ? (
            // ✅ Loading State
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>

              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Loading your test results...
              </p>
            </div>
          ) : testResults.length === 0 ? (
            // ✅ Empty State
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20">
              <div className="mb-4 text-6xl">📄</div>

              <h2 className="text-2xl font-semibold">No Test Results Found</h2>

              <p className="mt-2 max-w-md text-center text-muted-foreground">
                You haven’t attempted any tests yet. Start practicing to see
                your performance and results here.
              </p>
            </div>
          ) : (
            // Table Data
            <>
              <h2 className="mb-4 text-2xl font-semibold">Your Test Results</h2>

              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead rowSpan={3}>Test Title</TableHead>

                      <TableHead colSpan={8} className="text-center">
                        Subjects Wise
                      </TableHead>

                      <TableHead rowSpan={3}>Total Score</TableHead>
                      <TableHead rowSpan={3}>Submitted At</TableHead>
                      <TableHead rowSpan={3}>Actions</TableHead>
                    </TableRow>

                    <TableRow>
                      {testResults[0]?.subjectWiseResult?.map(
                        (subHead, ind) => (
                          <TableHead
                            key={ind}
                            colSpan={2}
                            className="text-center"
                          >
                            {subHead?.subjectName}
                          </TableHead>
                        ),
                      )}
                    </TableRow>

                    <TableRow>
                      {testResults[0]?.subjectWiseResult?.map((_, index) => (
                        <React.Fragment key={index}>
                          <TableHead className="text-center">Attempt</TableHead>

                          <TableHead className="text-center">Correct</TableHead>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {testResults.map((test, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {test.testTitle}
                        </TableCell>

                        {test?.subjectWiseResult?.map((sub, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableCell className="text-center">
                                <span className="font-semibold">
                                  {sub ? sub.attempted : "-"}
                                </span>
                                /{sub ? sub.totalQuestions : "-"}
                              </TableCell>

                              <TableCell className="text-center">
                                <span className="font-semibold text-green-600">
                                  {sub ? sub.correct : "-"}
                                </span>
                                /{sub ? sub.attempted : "-"}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}

                        <TableCell className="text-center font-semibold">
                          {test.totalScore}
                        </TableCell>

                        <TableCell className="text-sm">
                          {new Date(test.submittedAt).toLocaleString()}
                        </TableCell>

                        <TableCell className="text-center">
                          <EyeIcon
                            className={`mx-auto cursor-pointer hover:text-primary ${
                              selectedIndex === index ? "text-primary" : ""
                            }`}
                            onClick={() => setSelectedIndex(index)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>

        {/*  Subject-wise Graph */}
        {selectedTest && (
          <div className="">
            <div className="flex justify-between items-center">
              <h2 className="mb-4 text-2xl font-semibold">
                Subject Performance – {selectedTest.testTitle}
              </h2>
              <div className="flex gap-3 mb-4">
                <button
                  className={`px-4 py-2 rounded-[5px] hover:bg-primary text-white ${
                    viewType === "bar" ? "bg-primary" : "bg-gray-400"
                  }`}
                  onClick={() => setViewType("bar")}
                >
                  Bar Chart
                </button>

                <button
                  className={`px-4 py-2 rounded-[5px] hover:bg-primary text-white ${
                    viewType === "circular" ? "bg-primary" : "bg-gray-400"
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
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Total" fill="#a3a3a3" />
                        <Bar dataKey="Attempted" fill="#f59e0b" />
                        <Bar dataKey="Correct" fill="#10b981" />
                        <Bar dataKey="Wrong" fill="#ef4444" />
                        <Bar dataKey="Accuracy" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Tooltip />
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
