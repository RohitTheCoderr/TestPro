"use client";

import InputField from "@/components/shared/inputField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Examresponse, Exams, TestsResponse } from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  answer: number;
  details: string;
  isImage: boolean;
  image: string | null;
}

interface Subject {
  name: string;
  questions: Question[];
}

interface Exam {
  _id: string;
  name: string;
}

function CreateTest() {
  const router = useRouter();
  const categories = useAppSelector((state) => state.category.categories);
  const dispatch = useAppDispatch();
  // const exams = useAppSelector((state) => state.exam.exams);

  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Exams[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchExams = useCallback(
    async (categoryID: string) => {
      try {
        setLoading(true);

        const res = await apiClient.get<Examresponse>(
          `/admin/${categoryID}/exams/list`,
        );

        const examsData: Exams[] = res?.data?.exams || [];

        setExams(examsData);
      } catch (error) {
        console.error("Error fetching exams:", error);

        toast.error("Error while fetching exams");
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  // Fetch Exams On Category Change
  useEffect(() => {
    if (selectedCategory) {
      fetchExams(selectedCategory);
    }
  }, [selectedCategory, fetchExams]);

  const [testData, setTestData] = useState({
    examID: "",
    title: "",
    test_type: "mock",
    type: "free",
    status: true,
    duration: 60,
    price: 0,
    subjects: [] as Subject[],
  });

  // Add Subject
  const addSubject = () => {
    setTestData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: "",
          questions: [],
        },
      ],
    }));
  };

  // Update Subject Name
  const updateSubjectName = (index: number, value: string) => {
    const updated = [...testData.subjects];
    updated[index].name = value;

    setTestData({
      ...testData,
      subjects: updated,
    });
  };

  // Add Question
  const addQuestion = (subjectIndex: number) => {
    const updated = [...testData.subjects];

    updated[subjectIndex].questions.push({
      question: "",
      options: ["", "", "", ""],
      answer: 0,
      details: "",
      isImage: false,
      image: null,
    });

    setTestData({
      ...testData,
      subjects: updated,
    });
  };

  // Update Question
  const updateQuestion = (
    subjectIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: any,
  ) => {
    const updated = [...testData.subjects];

    (updated[subjectIndex].questions[questionIndex] as any)[field] = value;

    setTestData({
      ...testData,
      subjects: updated,
    });
  };

  // Update Option
  const updateOption = (
    subjectIndex: number,
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updated = [...testData.subjects];

    updated[subjectIndex].questions[questionIndex].options[optionIndex] = value;

    setTestData({
      ...testData,
      subjects: updated,
    });
  };

  // Submit
  const handleSubmit = async () => {
    console.log(testData);

    try {
      const res = await apiClient.post<TestsResponse>(
        `admin/test/create`,
        testData,
      );

      if (res.success) {
        toast.success(res.message);
        if (res) {
          router.push("/admin/tests");
        }
      }
    } catch (error) {
      console.log("errorr", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold">Create Test</h1>

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* <div>
            <label className="mb-2 block font-semibold">Select Category</label>

            <select
              className="w-full rounded-lg border p-3"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>

              {categories?.map((category: Category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.name}
                </option>
              ))}
            </select>
          </div> */}
          <div>
            <SelectGroup>
              <SelectLabel className="font-normal ">
                Select Category
              </SelectLabel>
            </SelectGroup>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat, index) => (
                  <SelectItem key={index} value={String(cat?.categoryID)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Exam Dropdown */}
          <div>
            <SelectGroup>
              <SelectLabel className="font-normal">Select Exam</SelectLabel>
            </SelectGroup>

            <Select
              value={testData.examID}
              onValueChange={(value) =>
                setTestData({
                  ...testData,
                  examID: value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>

              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.ExamID} value={exam.ExamID}>
                    {exam.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <InputField
              label="Test title"
              className="mt-2"
              name="test_title"
              type="text"
              placeholder="Enter test title"
              value={testData.title}
              onChange={(e) =>
                setTestData({
                  ...testData,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Duration */}
          <div>
            <InputField
              label="Duration (Minutes)"
              className="mt-2"
              name="duration"
              type="number"
              placeholder="Enter Duration (Minutes)"
              value={testData.duration}
              onChange={(e) =>
                setTestData({
                  ...testData,
                  duration: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Test Type */}
          <div>
            <SelectGroup>
              <SelectLabel className="font-normal">Test Type</SelectLabel>
            </SelectGroup>

            <Select
              value={testData.test_type}
              onValueChange={(value) =>
                setTestData({
                  ...testData,
                  test_type: value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Test Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={"mock"}>Mock</SelectItem>{" "}
                <SelectItem value={"practice"}>Practice</SelectItem>
                <SelectItem value={"previous year"}>Previous year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Free/Paid */}
          <div>
            <SelectGroup>
              <SelectLabel className="font-normal">Access Type</SelectLabel>
            </SelectGroup>

            <Select
              value={testData.type}
              onValueChange={(value) =>
                setTestData({
                  ...testData,
                  type: value,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Access Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={"free"}>Free</SelectItem>{" "}
                <SelectItem value={"paid"}>Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <InputField
              label="Price"
              className="mt-2"
              name="price"
              type="number"
              placeholder="Enter Price"
              value={testData.price}
              onChange={(e) =>
                setTestData({
                  ...testData,
                  price: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* Add Subject Button */}
        <div className="mt-8">
          <Button
            onClick={addSubject}
            // className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Subject
          </Button>
        </div>

        {/* Subjects */}
        <div className="mt-8 space-y-8">
          {testData.subjects.map((subject, subjectIndex) => (
            <div
              key={subjectIndex}
              className="rounded-xl border bg-gray-50 p-5"
            >
              {/* Subject Header */}
              <div className="mb-4 flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Subject Name"
                  className="w-full rounded-lg border p-3"
                  value={subject.name}
                  onChange={(e) =>
                    updateSubjectName(subjectIndex, e.target.value)
                  }
                />

                <button
                  onClick={() => addQuestion(subjectIndex)}
                  className="ml-4 whitespace-nowrap rounded-[2px] bg-green-600 px-4 py-3 text-white hover:bg-green-700"
                >
                  + Add Question
                </button>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {subject.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="rounded-xl border bg-white p-5"
                  >
                    <h2 className="mb-4 text-lg font-bold">
                      Question {questionIndex + 1}
                    </h2>

                    {/* Question */}
                    <textarea
                      placeholder="Enter Question"
                      className="mb-4 w-full rounded-lg border p-3"
                      rows={4}
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(
                          subjectIndex,
                          questionIndex,
                          "question",
                          e.target.value,
                        )
                      }
                    />

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <input
                          key={optionIndex}
                          type="text"
                          placeholder={`Option ${optionIndex + 1}`}
                          className="rounded-lg border p-3"
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              subjectIndex,
                              questionIndex,
                              optionIndex,
                              e.target.value,
                            )
                          }
                        />
                      ))}
                    </div>

                    {/* Answer */}
                    <div className="">
                      <SelectGroup>
                        <SelectLabel className="font-normal ">
                          Correct Answer
                        </SelectLabel>
                      </SelectGroup>

                      <Select
                        value={String(question.answer)}
                        onValueChange={(value) =>
                          updateQuestion(
                            subjectIndex,
                            questionIndex,
                            "answer",
                            Number(value),
                          )
                        }
                      >
                        <SelectTrigger className="w-full mb-1">
                          <SelectValue placeholder="Select Correct Answer" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="0">Option 1</SelectItem>
                          <SelectItem value="1">Option 2</SelectItem>
                          <SelectItem value="2">Option 3</SelectItem>
                          <SelectItem value="3">Option 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Details */}
                    <div className="mt-4">
                      <textarea
                        placeholder="Explanation / Details"
                        className="w-full rounded-lg border p-3"
                        rows={3}
                        value={question.details}
                        onChange={(e) =>
                          updateQuestion(
                            subjectIndex,
                            questionIndex,
                            "details",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    {/* Image Question */}
                    <div className="mt-4 flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={question.isImage}
                        onChange={(e) =>
                          updateQuestion(
                            subjectIndex,
                            questionIndex,
                            "isImage",
                            e.target.checked,
                          )
                        }
                      />

                      <label>Image Based Question</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-10">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white hover:bg-gray-800"
          >
            Create Test
          </button>
        </div>

        {/* JSON Preview */}
        <div className="mt-10">
          <h2 className="mb-3 text-2xl font-bold">JSON Preview</h2>

          <pre className="overflow-x-auto overflow-scroll max-h-96 rounded-xl bg-black p-5 text-sm text-green-400">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default CreateTest;
