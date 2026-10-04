"use client";

import Link from "next/link";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TruncateTextTooltip from "@/components/shared/truncketTooltip";
import { ChartBar, EyeIcon, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";

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
  attemptID: string;
  testID: string;
  testTitle: string;
  examName: string;
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [viewType, setViewType] = useState<"bar" | "circular">("bar");
  const [deletingAttemptId, setDeletingAttemptId] = useState<string | null>(
    null,
  );
  const [pendingDelete, setPendingDelete] = useState<{
    test: TestResult;
    index: number;
  } | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const user = useAppSelector((state) => state.auth.user) || null;
  const queryClient = useQueryClient();
  const deleteResultMutation = useMutation({
    mutationFn: async (attemptID: string) => {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/user/tests/testsresult/${attemptID}`);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete test result.");
      }
      return response;
    },
  });
  const {
    data: testResults = [],
    isLoading: load,
    error: resultsError,
  } = useQuery({
    queryKey: ["test-results", user?.userId],
    enabled: Boolean(user?.userId),
    queryFn: async () => {
      const response =
        await apiClient.get<ApiResponse>("/user/tests/testsresult");
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error(response.message || "Failed to load test results.");
      }
      return response.data;
    },
  });
  const selectedTest = testResults[selectedIndex];

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (pendingDelete && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [pendingDelete]);

  const handleDeleteResult = async (test: TestResult, index: number) => {
    setDeletingAttemptId(test.attemptID);
    try {
      const response = await deleteResultMutation.mutateAsync(test.attemptID);

      const remainingResults =
        testResults.filter((result) => result.attemptID !== test.attemptID);
      queryClient.setQueryData<TestResult[]>(
        ["test-results", user?.userId],
        (currentResults) =>
          currentResults?.filter(
            (result) => result.attemptID !== test.attemptID,
          ),
      );
      queryClient.removeQueries({
        queryKey: ["test-result-details", user?.userId, test.attemptID],
      });
      setSelectedIndex((currentIndex) => {
        if (index < currentIndex) return currentIndex - 1;
        if (index === currentIndex) {
          return Math.max(
            0,
            Math.min(currentIndex, remainingResults.length - 1),
          );
        }
        return currentIndex;
      });
      setPendingDelete(null);
      toast.success(response.message);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete test result.",
      );
    } finally {
      setDeletingAttemptId(null);
    }
  };

  useEffect(() => {
    if (resultsError) {
      toast.error(
        resultsError instanceof Error
          ? resultsError.message
          : "An unexpected error occurred.",
      );
    }
  }, [resultsError]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="container mx-auto flex-1 px-4 py-8 ">
        {/* Header */}
        <div className="mb-8 rounded-full bg-gradient-to-r text-center from-primary to-accent p-2 sm:p-8 text-card shadow-lg">
          <h1 className="mb-2 text-xl sm:text-4xl font-bold lg:text-5xl">
            Welcome to your results dashboard, {user?.name || "User"}!
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
              <div className="overflow-x-auto rounded-xl border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SR</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead className="text-center">Attempted</TableHead>
                      <TableHead className="text-center">Correct</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {testResults.map((test, index) => {
                      const totalQuestions = test.subjectWiseResult.reduce(
                        (total, subject) => total + subject.totalQuestions,
                        0,
                      );

                      const totalAttempted = test.subjectWiseResult.reduce(
                        (total, subject) => total + subject.attempted,
                        0,
                      );

                      const totalCorrect = test.subjectWiseResult.reduce(
                        (total, subject) => total + subject.correct,
                        0,
                      );

                      const totalWrong = test.subjectWiseResult.reduce(
                        (total, subject) => total + subject.wrong,
                        0,
                      );

                      const percentage =
                        totalQuestions > 0
                          ? Math.round((totalCorrect / totalQuestions) * 100)
                          : 0;

                      return (
                        <TableRow key={test.attemptID}>
                          {/* SR */}
                          <TableCell>
                            <span className="font-semibold">{index + 1}</span>
                          </TableCell>

                          {/* Test */}
                          <TableCell>
                            <div>
                              <p className="font-semibold">{test.testTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {test.examName}
                              </p>
                            </div>
                          </TableCell>

                          {/* Subjects */}
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                              <TruncateTextTooltip
                                text={test.subjectWiseResult
                                  .map((subject) => subject.subjectName)
                                  .join(", ")}
                                maxWidth="max-w-[440px]"
                                className=" bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                              />
                            </div>
                          </TableCell>

                          {/* Attempted */}
                          <TableCell className="text-center">
                            <span className="font-semibold">
                              {totalAttempted}
                            </span>
                            <span className="text-muted-foreground">
                              /{totalQuestions}
                            </span>
                          </TableCell>

                          {/* Correct */}
                          <TableCell className="text-center">
                            <span className="font-semibold text-green-600">
                              {totalCorrect}
                            </span>
                            <span className="text-muted-foreground">
                              /{totalAttempted}
                            </span>

                            {totalWrong > 0 && (
                              <p className="text-xs text-red-500">
                                {totalWrong} wrong
                              </p>
                            )}
                          </TableCell>

                          {/* Score */}
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold">
                                {test.totalScore}
                              </span>

                              <span
                                className={`text-xs font-semibold ${
                                  percentage >= 75
                                    ? "text-green-600"
                                    : percentage >= 50
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {percentage}%
                              </span>
                            </div>
                          </TableCell>

                          {/* Submitted */}
                          <TableCell className="text-sm text-center whitespace-nowrap">
                            {new Date(test.submittedAt).toLocaleDateString()}
                          </TableCell>

                          {/* Action */}
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Link
                                href={`/dashboard/results/${test.attemptID}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded bg-green-50 p-0 text-green-600 transition-colors hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                aria-label={`View detailed result for ${test.testTitle}`}
                                title="View detailed result"
                              >
                                <EyeIcon size={15} />
                              </Link>
                              <Button
                                variant="edit"
                                onClick={() => setSelectedIndex(index)}
                                aria-label={`View chart for ${test.testTitle}`}
                                title="View result on chart"
                                className={`${selectedIndex === index ? "bg-primary" : ""}`}
                              >
                                <ChartBar size={15} />
                              </Button>
                              <Button
                                variant="delete"
                                onClick={() =>
                                  setPendingDelete({ test, index })
                                }
                                aria-label={`Delete result for ${test.testTitle}`}
                                title="Delete result"
                                disabled={deletingAttemptId !== null}
                              >
                                <Trash2 size={15} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
      {pendingDelete && (
        <dialog
          ref={deleteDialogRef}
          aria-labelledby="delete-result-title"
          aria-describedby="delete-result-description"
          onCancel={(event) => {
            event.preventDefault();
            if (deletingAttemptId !== pendingDelete.test.attemptID) {
              setPendingDelete(null);
            }
          }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-card p-0 text-foreground shadow-xl backdrop:bg-black/50"
        >
          <div className="p-6">
            <h2 id="delete-result-title" className="text-lg font-semibold">
              Delete test result?
            </h2>
            <p
              id="delete-result-description"
              className="mt-2 text-sm text-muted-foreground"
            >
              Delete the result for &quot;{pendingDelete.test.testTitle}
              &quot;? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={deletingAttemptId === pendingDelete.test.attemptID}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="delete"
                disabled={deletingAttemptId === pendingDelete.test.attemptID}
                onClick={() =>
                  handleDeleteResult(pendingDelete.test, pendingDelete.index)
                }
              >
                {deletingAttemptId === pendingDelete.test.attemptID
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
