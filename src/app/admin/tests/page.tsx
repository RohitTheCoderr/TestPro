"use client";
import { Timehelper } from "@/components/shared/timehelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CategoryResponse,
  Examresponse,
  Exams,
  TestsResponse,
} from "@/Interfaces";
import { Test } from "@/Interfaces/TestInterfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useQuery } from "@tanstack/react-query";
// import { SelectItem } from "@radix-ui/react-select";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function TestsPage() {
  const [examIDstate, setExamIDstate] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramExamID = searchParams.get("examID");
  const queryString = searchParams.toString();
  const {
    data: exams = [],
    isLoading: loadingExams,
    error: examsError,
  } = useQuery({
    queryKey: ["admin-test-exam-options"],
    queryFn: async () => {
      const categoriesResponse = await apiClient.get<CategoryResponse>(
        "/admin/category/list",
      );
      const categoryList = categoriesResponse.data?.categories ?? [];
      const examResponses = await Promise.all(
        categoryList.map((category) =>
          apiClient.get<Examresponse>(
            `/admin/${category.categoryID}/exams/list`,
          ),
        ),
      );
      return examResponses.flatMap((response) => response.data?.exams ?? []);
    },
  });

  useEffect(() => {
    if (loadingExams) return;

    const selectedExam = exams.find((exam) => exam.ExamID === paramExamID);
    const nextExamID = selectedExam?.ExamID ?? exams[0]?.ExamID ?? "";
    setExamIDstate(nextExamID);

    if (nextExamID !== paramExamID) {
      const nextParams = new URLSearchParams(queryString);
      if (nextExamID) nextParams.set("examID", nextExamID);
      else nextParams.delete("examID");
      router.replace(
        nextParams.size
          ? `/admin/tests?${nextParams.toString()}`
          : "/admin/tests",
        { scroll: false },
      );
    }
  }, [exams, loadingExams, paramExamID, queryString, router]);

  const {
    data: testList = [],
    isLoading: loading,
    error: testsError,
  } = useQuery({
    queryKey: ["admin-tests", examIDstate],
    enabled: Boolean(examIDstate),
    queryFn: async () => {
      const response = await apiClient.get<TestsResponse>(
        `/admin/test/list/${examIDstate}`,
      );
      return response.tests ?? [];
    },
  });

  useEffect(() => {
    for (const error of [examsError, testsError]) {
      if (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load data.");
      }
    }
  }, [examsError, testsError]);

  const handleExamChange = (value: string) => {
    setExamIDstate(value);
    const nextParams = new URLSearchParams(queryString);
    nextParams.set("examID", value);
    router.replace(`/admin/tests?${nextParams.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4 text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tests</h2>
        <div className="flex justify-start gap-4 items-center">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-zinc-600
          hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <Link
            href="/admin/tests/create"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Test
          </Link>
        </div>
      </div>

      <div>
        <Select value={examIDstate} onValueChange={handleExamChange}>
          <SelectTrigger className="mb-1 w-[15rem] bg-background text-foreground">
            <SelectValue
              placeholder={loadingExams ? "Loading exams..." : "Select exam"}
            />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            {exams?.map((exam, index) => (
              <SelectItem key={index} value={exam.ExamID}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!loadingExams && exams.length === 0 && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            No exams available.
          </p>
        )}
      </div>

      {loading ? (
        <p className="my-12 text-center">Loading tests...</p>
      ) : testList?.length == 0 ? (
        <p className="text-center my-12">
          No test found under this Exam Category
        </p>
      ) : (
        <Table className="border-border text-foreground">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Test ID
              </TableHead>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Exam ID
              </TableHead>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Test Title
              </TableHead>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Type
              </TableHead>
              <TableHead className="bg-slate-200 text-center text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Duration (In min.)
              </TableHead>
              <TableHead className="bg-slate-200 text-center text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Price
              </TableHead>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Subjects
              </TableHead>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                CreatedAt
              </TableHead>
              <TableHead className="bg-slate-200 text-start text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                UpdatedAt
              </TableHead>
              <TableHead className="bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Status
              </TableHead>
              <TableHead className="bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow aria-rowspan={5}>
                <TableCell> Loading...</TableCell>
              </TableRow>
            )}
            {testList?.length > 0 &&
              testList.map((test: Test, index: number) => (
                <TableRow
                  key={index}
                  className={
                    index % 2 !== 0
                      ? "bg-slate-50 dark:bg-slate-800/70"
                      : "bg-background"
                  }
                >
                  <TableCell>{test.testID}</TableCell>
                  <TableCell>{test.examID}</TableCell>
                  <TableCell>{test.title}</TableCell>
                  <TableCell className="capitalize">{test.type}</TableCell>
                  <TableCell className="text-center">{test.duration}</TableCell>
                  <TableCell className="text-center">{test.price}</TableCell>
                  <TableCell className=" max-w-[800px]">
                    {/* <TruncateTextTooltip
                    text={test.categoryDetails?.details ?? ""}
                    maxWidth="max-w-[800px]"
                    />{" "} */}
                  </TableCell>
                  <TableCell>
                    <Timehelper data={test.createdAt ?? ""} />
                  </TableCell>
                  <TableCell>
                    <Timehelper data={test.updatedAt ?? ""} />
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        test.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {test.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/tests/edit/${test.testID}`}
                      className="flex items-center justify-center text-blue-600 dark:text-blue-400"
                    >
                      <Edit />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default TestsPage;
