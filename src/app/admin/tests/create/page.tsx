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
import {
  CategoryResponse,
  Examresponse,
  Exams,
  SingleTestsResponse,
  TestsResponse,
} from "@/Interfaces";
import { apiClient } from "@/lib/API/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

interface TestFormData {
  examID: string;
  title: string;
  test_type: string;
  type: string;
  status: boolean;
  duration: number;
  price: number;
  subjects: Subject[];
}

interface AdminTestResponse extends SingleTestsResponse {
  categoryID: string;
}

function CreateTest() {
  const router = useRouter();
  const params = useParams<{ testID?: string }>();
  const testID = params?.testID;
  const isEditing = Boolean(testID);
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories", { status: true }],
    queryFn: async () => {
      const response = await apiClient.get<CategoryResponse>(
        "/admin/category/list",
        { status: true },
      );
      return response.data?.categories ?? [];
    },
  });

  const [entryMode, setEntryMode] = useState<"manual" | "json">("manual");
  const [subjectsJson, setSubjectsJson] = useState('{\n  "subjects": []\n}');

  const [selectedCategory, setSelectedCategory] = useState("");

  const queryClient = useQueryClient();
  const {
    data: exams = [],
    isLoading: loadingExams,
    error: examsError,
  } = useQuery({
    queryKey: ["admin-exams", selectedCategory],
    enabled: Boolean(selectedCategory),
    queryFn: async () => {
      const response = await apiClient.get<Examresponse>(
        `/admin/${selectedCategory}/exams/list`,
      );
      return response.data?.exams ?? [];
    },
  });

  const [testData, setTestData] = useState<TestFormData>({
    examID: "",
    title: "",
    test_type: "mock",
    type: "free",
    status: true,
    duration: 60,
    price: 0,
    subjects: [],
  });

  const {
    data: loadedTest,
    isLoading: loadingTest,
    error: testError,
  } = useQuery({
    queryKey: ["admin-test", testID],
    enabled: Boolean(testID),
    queryFn: () => apiClient.get<AdminTestResponse>(`/admin/test/${testID}`),
  });

  useEffect(() => {
    if (!loadedTest) return;
    const test = loadedTest.test;
    const loadedData: TestFormData = {
      examID: test.examID,
      title: test.title,
      test_type: test.test_type ?? "mock",
      type: test.type,
      status: test.status,
      duration: test.duration,
      price: test.price,
      subjects: (test.subjects ?? []) as unknown as Subject[],
    };

    setSelectedCategory(loadedTest.categoryID);
    setTestData(loadedData);
    setSubjectsJson(
      JSON.stringify(
        { categoryID: loadedTest.categoryID, ...loadedData },
        null,
        2,
      ),
    );
  }, [loadedTest]);

  useEffect(() => {
    const error = examsError ?? testError;
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load test data.",
      );
    }
  }, [examsError, testError]);

  const saveTestMutation = useMutation({
    mutationFn: async (payload: TestFormData) => {
      const response = isEditing
        ? await apiClient.patch<TestsResponse>(`/admin/test/${testID}`, payload)
        : await apiClient.post<TestsResponse>("/admin/test/create", payload);
      if (!response.success) {
        throw new Error(response.message || "Unable to save test.");
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      void queryClient.invalidateQueries({ queryKey: ["admin-tests"] });
      void queryClient.invalidateQueries({ queryKey: ["tests-by-exam"] });
      void queryClient.invalidateQueries({ queryKey: ["test-details"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-test", testID] });
      router.push("/admin/tests");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Unable to ${isEditing ? "update" : "create"} test.`,
      );
    },
  });
  const loading = loadingExams || loadingTest;
  const submitting = saveTestMutation.isPending;

  if (testID && testError) {
    return (
      <p role="alert" className="text-center text-red-600">
        {testError instanceof Error
          ? testError.message
          : "Unable to load test."}
      </p>
    );
  }

  const updateTestField = <K extends keyof TestFormData>(
    field: K,
    value: TestFormData[K],
  ) => {
    setTestData((previous) => ({ ...previous, [field]: value }));
    if (entryMode === "json") {
      setSubjectsJson((previousJson) => {
        try {
          const current = JSON.parse(previousJson) as Record<string, unknown>;
          return JSON.stringify(
            { ...current, categoryID: selectedCategory, [field]: value },
            null,
            2,
          );
        } catch {
          return JSON.stringify(
            { ...testData, categoryID: selectedCategory, [field]: value },
            null,
            2,
          );
        }
      });
    }
  };

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

  const addOption = (subjectIndex: number, questionIndex: number) => {
    const updated = testData.subjects.map((subject, currentSubjectIndex) =>
      currentSubjectIndex === subjectIndex
        ? {
            ...subject,
            questions: subject.questions.map(
              (question, currentQuestionIndex) =>
                currentQuestionIndex === questionIndex
                  ? { ...question, options: [...question.options, ""] }
                  : question,
            ),
          }
        : subject,
    );
    setTestData((previous) => ({ ...previous, subjects: updated }));
  };

  const removeOption = (
    subjectIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const updated = testData.subjects.map((subject, currentSubjectIndex) =>
      currentSubjectIndex === subjectIndex
        ? {
            ...subject,
            questions: subject.questions.map(
              (question, currentQuestionIndex) => {
                if (
                  currentQuestionIndex !== questionIndex ||
                  question.options.length <= 2
                ) {
                  return question;
                }
                const options = question.options.filter(
                  (_, index) => index !== optionIndex,
                );
                return {
                  ...question,
                  options,
                  answer:
                    question.answer === optionIndex
                      ? 0
                      : question.answer > optionIndex
                        ? question.answer - 1
                        : question.answer,
                };
              },
            ),
          }
        : subject,
    );
    setTestData((previous) => ({ ...previous, subjects: updated }));
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
  const handleSubmit = () => {
    let submissionData = testData;
    if (entryMode === "json") {
      try {
        const parsed: unknown = JSON.parse(subjectsJson);
        const parsedSubjects = Array.isArray(parsed)
          ? parsed
          : parsed && typeof parsed === "object"
            ? (parsed as { subjects?: unknown }).subjects
            : undefined;
        if (!Array.isArray(parsedSubjects)) {
          toast.error(
            'JSON must be a test object containing a "subjects" array, or a subjects array.',
          );
          return;
        }
        submissionData = Array.isArray(parsed)
          ? { ...testData, subjects: parsedSubjects as Subject[] }
          : {
              ...testData,
              ...(parsed as Partial<TestFormData>),
              subjects: parsedSubjects as Subject[],
            };
      } catch {
        toast.error("Please enter valid JSON before saving the test.");
        return;
      }
    }

    const subjects = submissionData.subjects;
    if (!submissionData.examID || !submissionData.title?.trim()) {
      toast.error("Select an exam and enter a test title.");
      return;
    }
    if (
      !subjects.length ||
      subjects.some(
        (subject) =>
          !subject ||
          typeof subject.name !== "string" ||
          !subject.name.trim() ||
          !Array.isArray(subject.questions) ||
          subject.questions.length === 0,
      )
    ) {
      toast.error("Add at least one named subject with one or more questions.");
      return;
    }
    const invalidQuestion = subjects.some((subject) =>
      subject.questions.some(
        (question) =>
          !question ||
          typeof question.question !== "string" ||
          !question.question.trim() ||
          !Array.isArray(question.options) ||
          question.options.length < 2 ||
          question.options.some(
            (option) => typeof option !== "string" || !option.trim(),
          ) ||
          !Number.isInteger(question.answer) ||
          question.answer < 0 ||
          question.answer >= question.options.length,
      ),
    );
    if (invalidQuestion) {
      toast.error(
        "Complete each question, its options, and a valid correct answer.",
      );
      return;
    }

    saveTestMutation.mutate({ ...submissionData, subjects });
  };

  return (
    <div className="mx-auto max-w-7xl text-foreground">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-zinc-600
                  hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Test" : "Create Test"}
        </h1>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <SelectGroup>
            <SelectLabel className="font-normal ">Select Category</SelectLabel>
          </SelectGroup>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              updateTestField("examID", "");
              if (entryMode === "json") {
                setSubjectsJson((previousJson) => {
                  try {
                    return JSON.stringify(
                      {
                        ...JSON.parse(previousJson),
                        categoryID: value,
                        examID: "",
                      },
                      null,
                      2,
                    );
                  } catch {
                    return JSON.stringify(
                      { ...testData, categoryID: value, examID: "" },
                      null,
                      2,
                    );
                  }
                });
              }
            }}
          >
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-background text-foreground">
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
            onValueChange={(value) => updateTestField("examID", value)}
          >
            <SelectTrigger className="w-full bg-background text-foreground">
              <SelectValue placeholder="Select Exam" />
            </SelectTrigger>

            <SelectContent className="bg-background text-foreground">
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
            onChange={(e) => updateTestField("title", e.target.value)}
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
              updateTestField("duration", Number(e.target.value))
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
            onValueChange={(value) => updateTestField("test_type", value)}
          >
            <SelectTrigger className="w-full bg-background text-foreground">
              <SelectValue placeholder="Select Test Type" />
            </SelectTrigger>

            <SelectContent className="bg-background text-foreground">
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
            onValueChange={(value) => updateTestField("type", value)}
          >
            <SelectTrigger className="w-full bg-background text-foreground">
              <SelectValue placeholder="Select Access Type" />
            </SelectTrigger>

            <SelectContent className="bg-background text-foreground">
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
            onChange={(e) => updateTestField("price", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-8 border-b pb-5">
        <p className="mb-3 font-semibold">
          How would you like to add questions?
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Question entry method"
        >
          <Button
            type="button"
            variant={entryMode === "manual" ? "default" : "outline"}
            onClick={() => setEntryMode("manual")}
          >
            Form, one by one
          </Button>
          <Button
            type="button"
            variant={entryMode === "json" ? "default" : "outline"}
            onClick={() => {
              setSubjectsJson(
                JSON.stringify(
                  { categoryID: selectedCategory, ...testData },
                  null,
                  2,
                ),
              );
              setEntryMode("json");
            }}
          >
            Paste question JSON
          </Button>
        </div>
      </div>

      {entryMode === "manual" ? (
        <>
          <div className="mt-6">
            <Button type="button" onClick={addSubject}>
              + Add Subject
            </Button>
          </div>
          <div className="mt-8 space-y-8">
            {testData.subjects.map((subject, subjectIndex) => (
              <div
                key={subjectIndex}
                className="rounded-xl border border-border bg-muted/40 p-5"
              >
                {/* Subject Header */}
                <div className="mb-4 flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="w-full rounded-lg border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={subject.name}
                    onChange={(e) =>
                      updateSubjectName(subjectIndex, e.target.value)
                    }
                  />

                  <button
                    type="button"
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
                      className="rounded-xl border border-border bg-card p-5 text-card-foreground"
                    >
                      <h2 className="mb-4 text-lg font-bold">
                        Question {questionIndex + 1}
                      </h2>

                      {/* Question */}
                      <textarea
                        placeholder="Enter Question"
                        className="mb-4 w-full rounded-lg border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                          <div
                            key={optionIndex}
                            className="flex gap-2 items-center"
                          >
                            <input
                              type="text"
                              placeholder={`Option ${optionIndex + 1}`}
                              className="min-w-0 flex-1 rounded-lg border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                            {question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="delete"
                                onClick={() =>
                                  removeOption(
                                    subjectIndex,
                                    questionIndex,
                                    optionIndex,
                                  )
                                }
                                aria-label={`Remove option ${optionIndex + 1}`}
                              >
                                <Trash2 size={15} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => addOption(subjectIndex, questionIndex)}
                      >
                        + Add Option
                      </Button>

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
                          <SelectTrigger className="mb-1 w-full bg-background text-foreground">
                            <SelectValue placeholder="Select Correct Answer" />
                          </SelectTrigger>

                          <SelectContent className="bg-background text-foreground">
                            {question.options.map((_, optionIndex) => (
                              <SelectItem
                                key={optionIndex}
                                value={String(optionIndex)}
                              >
                                Option {optionIndex + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Details */}
                      <div className="mt-4">
                        <textarea
                          placeholder="Explanation / Details"
                          className="w-full rounded-lg border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                  <div className="border-t pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addQuestion(subjectIndex)}
                    >
                      + Add Question to{" "}
                      {subject.name || `Subject ${subjectIndex + 1}`}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8">
          <label htmlFor="subjects-json" className="mb-2 block font-semibold">
            Test JSON
          </label>
          <p className="mb-3 text-sm text-muted-foreground">
            This object includes the selected category, exam, test details, and
            the <code>subjects</code> question array. Correct answers use a
            zero-based option index.
          </p>
          <textarea
            id="subjects-json"
            className="min-h-[28rem] w-full rounded-lg border border-border bg-slate-950 p-4 font-mono text-sm text-green-300"
            value={subjectsJson}
            onChange={(event) => setSubjectsJson(event.target.value)}
            spellCheck={false}
            placeholder={
              '{\n  "categoryID": "...",\n  "examID": "...",\n  "title": "...",\n  "test_type": "mock",\n  "type": "free",\n  "duration": 60,\n  "price": 0,\n  "subjects": []\n}'
            }
          />
        </div>
      )}

      {/* Submit */}
      <div className="mt-10 flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tests")}
          aria-label="Back to tests"
        >
          Cancle
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Test"
              : "Create Test"}
        </Button>
      </div>

      {/* JSON Preview */}
      {entryMode === "manual" && (
        <div className="mt-10">
          <h2 className="mb-3 text-2xl font-bold">JSON Preview</h2>

          <pre className="overflow-x-auto overflow-scroll max-h-96 rounded-xl bg-black p-5 text-sm text-green-400">
            {JSON.stringify(
              { categoryID: selectedCategory, ...testData },
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CreateTest;
