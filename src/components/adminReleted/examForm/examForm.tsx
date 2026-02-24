import { Examresponse, Exams, SingleExamResponse } from "@/Interfaces";
import React, { useEffect, useState } from "react";

import { motion, number } from "framer-motion";
import { apiClient } from "@/lib/API/apiClient";
import { ArrowLeft, FileText, Save, Tag } from "lucide-react";
import InputField from "@/components/shared/inputField";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type examFormProps = {
  exam?: Exams;
};

function ExamForm({ exam }: examFormProps) {
  const router = useRouter();
  const [formdata, setFormdata] = useState({
    name: exam?.name ?? "",
    status: exam?.status ?? true,
    // details: exam?.examDetails.details || [],
    negativeMark: exam?.examDetails.negativeMark ?? "",
    permark: exam?.examDetails.permark ?? "",
    totalQuestion: exam?.examDetails.totalQuestion ?? "",
    totalmarks: exam?.examDetails.totalmarks ?? "",
    otherdetails: exam?.examDetails.otherdetails ?? "",
  });
  const [details, setDetails] = useState<string[]>([]);

  const [formError, setFormError] = useState({
    name: "",
    status: "",
    details: "",
    negativeMark: "",
    permark: "",
    totalQuestion: "",
    totalmarks: "",
  });

  console.log("exams", exam);

  useEffect(() => {
    if (exam?.examDetails?.details?.length) {
      setDetails(exam.examDetails.details);
    } else {
      setDetails([""]); // create mode
    }
  }, [exam]);

  const handlechange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormError({
      ...formError,
      [name]: "",
    });
    setFormdata({
      ...formdata,
      [name]: type == "checkbox" ? checked : value,
    });
  };

  const handleEditAPI = async (payload: Exams) => {
    try {
      const res = await apiClient.patch<SingleExamResponse>(
        `admin/exam/update`,
        payload,
      );

      console.log("res", res);

      if (res.success) {
        toast.success(res.message);
        if (res) {
          router.push("/admin/exams");
        }
      }
    } catch (error) {
      console.log("errorr", error);
    }
  };

  const hanglesubmit = async (e: any) => {
    e.preventDefault();

    const setformError = {
      name: "",
      status: "",
      details: "",
      negativeMark: "",
      permark: "",
      totalQuestion: "",
      totalmarks: "",
    };

    let hasError = false;

    if (!formdata.name) {
      setformError.name = "Please enter Exam name";
      hasError = true;
    }
    if (!formdata.negativeMark) {
      setformError.negativeMark = "Please enter negativeMark";
      hasError = true;
    }
    if (!formdata.permark) {
      setformError.permark = "Please enter permark";
      hasError = true;
    }
    if (!formdata.totalQuestion) {
      setformError.totalQuestion = "Please enter totalQuestion";
      hasError = true;
    }
    if (!formdata.totalmarks) {
      setformError.totalmarks = "Please enter totalmarks";
      hasError = true;
    }

    if (hasError) {
      setFormError(setformError);
      return;
    }

    const payload: Exams = {
      name: formdata.name,
      status: formdata.status,
      ExamID: exam?.ExamID || "",
      categoryID: exam?.categoryID || "",
      slug: formdata.name || "",
      examDetails: {
        details: details.map((d) => d.trim()).filter(Boolean),
        negativeMark: Number(formdata.negativeMark),
        permark: Number(formdata.permark),
        totalQuestion: Number(formdata.totalQuestion),
        totalmarks: Number(formdata.totalmarks),
        otherdetails: formdata.otherdetails,
        _id: exam?.examDetails._id,
      },
    };

    if (payload.ExamID) {
      handleEditAPI(payload);
    } else {
      console.log("createAPI hanfle");
    }
  };

  return (
    <motion.form
      onSubmit={hanglesubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className=" mx-auto rounded-2xl bg-white dark:bg-zinc-900
                 shadow-lg border border-zinc-200 dark:border-zinc-800
                 p-6 space-y-6"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">
              {exam ? "Edit Exam" : "create new Exam"}
            </h2>
            <p className="text-sm text-zinc-500">
              Manage Exam details and status
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-zinc-600
                     hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <InputField
          className="mb-4"
          icon={<Tag size={18} />}
          label="Exam Name"
          name="name"
          formError={formError.name}
          value={formdata.name}
          placeholder={"Enter Exam name"}
          onChange={handlechange}
        />
        <div className="flex gap-4 items-center flex-wrap">
          <InputField
            className="mb-4"
            icon={<Tag size={18} />}
            label="Negative Mark"
            name="negativeMark"
            type={number}
            formError={formError.negativeMark}
            value={formdata.negativeMark}
            placeholder={"Enter negative Mark"}
            onChange={handlechange}
          />
          <InputField
            className="mb-4"
            icon={<Tag size={18} />}
            label="Exam permark"
            name="permark"
            type={number}
            formError={formError.permark}
            value={formdata.permark}
            placeholder={"Enter Permark"}
            onChange={handlechange}
          />
          <InputField
            className="mb-4"
            icon={<Tag size={18} />}
            label="Exam Total totalmarks"
            name="totalmarks"
            type={number}
            formError={formError.totalmarks}
            value={formdata.totalmarks}
            placeholder={"Enter totalmarks"}
            onChange={handlechange}
          />
          <InputField
            className="mb-4"
            icon={<Tag size={18} />}
            label="Exam Total totalQuestion"
            name="totalQuestion"
            type="number"
            formError={formError.totalQuestion}
            value={formdata.totalQuestion}
            placeholder={"Enter totalQuestion"}
            onChange={handlechange}
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <p>Details</p>
          <button
            type="button"
            className="bg-green-600 p-2 "
            onClick={() => setDetails([...details, ""])}
          >
            + Add Sentence
          </button>
        </div>
        {details.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              placeholder={`Sentence ${index + 1}`}
              onChange={(e) => {
                setDetails((prev) => {
                  const updated = [...prev];
                  updated[index] = e.target.value;
                  return updated;
                });
              }}
              className="border rounded p-2 w-full text-gray-600 text-[14px]"
            />

            {details.length > 1 && (
              <button
                type="button"
                className="bg-gray-200 px-4"
                onClick={() =>
                  setDetails((prev) => prev.filter((_, i) => i !== index))
                }
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <InputField
          className="mb-4"
          icon={<Tag size={18} />}
          label="Exam Other details"
          name="otherdetails"
          type="text"
          value={formdata.otherdetails}
          placeholder={"Enter other details"}
          onChange={handlechange}
        />
        {/* <InputField
        className="mb-4"
            icon={<Tag size={18} />}
            label="Exam status"
            name="status"
            type="checkbox"
            formError={formError.status}
            value={formdata.status}
            onChange={handlechange}
          /> */}
        <div
          className="flex items-center justify-between rounded-xl border
                      border-zinc-200 dark:border-zinc-800
                      bg-zinc-50 dark:bg-zinc-950 p-4"
        >
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Active Status
            </p>
            <p className="text-xs text-zinc-500">
              Enable or disable this category
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              name="status"
              checked={formdata.status}
              onChange={handlechange}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-zinc-300 peer-checked:bg-blue-600
                          rounded-full transition-all"
            />
            <div
              className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full
                          transition-transform peer-checked:translate-x-5"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-lg
                    px-6 py-2 text-white
                      transition ${exam ? " bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            <Save size={16} />

            {exam ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

export default ExamForm;
