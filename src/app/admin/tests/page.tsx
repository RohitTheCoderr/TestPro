"use client";
import { Timehelper } from "@/components/shared/timehelper";
import TruncateTextTooltip from "@/components/shared/truncketTooltip";
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
import { TestsResponse } from "@/Interfaces";
import { Test } from "@/Interfaces/TestInterfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useAppSelector } from "@/lib/redux/hooks";
// import { SelectItem } from "@radix-ui/react-select";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function TestsPage() {
  const [examIDstate, setExamIDstate] = useState<string>("");

  const param = useSearchParams();
  const paramExamID = param.get("examID");

  const exams = useAppSelector((s) => s.exams.examsList);

  const [loading, setloading] = useState(false);
  const [testList, setTestList] = useState<Test[]>([]);

  useEffect(() => {
    if (paramExamID) {
      setExamIDstate(paramExamID);
    }

    if (examIDstate) {
      fetchTestdata(examIDstate);
    }
  }, [paramExamID, examIDstate]);

  const fetchTestdata = async (ExamID: string) => {
    try {
      setloading(true);
      const response = await apiClient.get<TestsResponse>(
        `/admin/test/list/${ExamID}`,
      );
      if (response.success) {
        setloading(false);
        const tests: Test[] = response.tests ?? [];
        setTestList(tests);
      }
    } catch (error) {
      console.log("error fetch:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="space-y-4">
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
        <Select
          value={examIDstate}
          onValueChange={(value) => setExamIDstate(value)}
        >
          <SelectTrigger className="w-[15rem] mb-1">
            <SelectValue placeholder="Select Exam Category" />
          </SelectTrigger>
          <SelectContent>
            {exams?.map((exam, index) => (
              <SelectItem key={index} value={exam.ExamID}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
          {!examIDstate && (
            <p className="text-xs text-red-500">
              Please choose any exam category
            </p>
          )}
        </Select>
      </div>

      {testList?.length == 0 ? (
        <p className="text-center my-12">
          No test found under this Exam Category
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900">
              <TableHead className="text-start">Test ID</TableHead>
              <TableHead className="text-start">Exam ID</TableHead>
              <TableHead className="text-start">Test Title</TableHead>
              <TableHead className="text-start">Type</TableHead>
              <TableHead className="text-center">Duration (In min.)</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-start">Subjects</TableHead>
              <TableHead className="text-start">CreatedAt</TableHead>
              <TableHead className="text-start">UpdatedAt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
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
                  className={`${index % 2 != 0 ? "bg-slate-50" : ""}`}
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
                      className="text-blue-600 flex justify-center items-center"
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
