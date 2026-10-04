"use client";
import ExamForm from "@/components/adminReleted/examForm/examForm";
import { Loader } from "@/components/shared/loader";
import { SingleExamResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function EditExamPage() {
  const param = useParams<{ examID: string }>();
  const ExamID = param.examID;
  const { data: examData, error, isLoading } = useQuery({
    queryKey: ["admin-exam", ExamID],
    enabled: Boolean(ExamID),
    queryFn: async () => {
      const response = await apiClient.get<SingleExamResponse>(
        `/admin/exam/${ExamID}`,
      );
      return response.data.exam;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load exam.",
      );
    }
  }, [error]);

  if (isLoading || !examData) {
    if (error) {
      return (
        <p role="alert" className="text-center text-red-600">
          {error instanceof Error ? error.message : "Unable to load exam."}
        </p>
      );
    }
    return <Loader />;
  }

  return <ExamForm exam={examData} />;
}

export default EditExamPage;
