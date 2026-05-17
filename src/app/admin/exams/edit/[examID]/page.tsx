"use client";
import ExamForm from "@/components/adminReleted/examForm/examForm";
import { Loader } from "@/components/shared/loader";
import { Exams, SingleExamResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function EditExamPage() {
  const param = useParams<{ examID: string }>();
  const ExamID = param.examID;
  const [examData, setExamData] = useState<Exams>();

  const fetchExamdetails = async (examID: string) => {
    try {
      const res = await apiClient.get<SingleExamResponse>(
        `/admin/exam/${examID}`,
      );
      setExamData(res.data.exam);
    } catch (error) {
      console.log("errrrr", error);
    } finally {
      console.log("finally");
    }
  };

  useEffect(() => {
    if (ExamID) {
      fetchExamdetails(ExamID);
    }
  }, [ExamID]);

  if (!examData) {
    return <Loader />;
  }

  return <ExamForm exam={examData} />;
}

export default EditExamPage;
