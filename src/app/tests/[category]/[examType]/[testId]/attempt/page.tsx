"use client";
import { apiClient } from "@/lib/API/apiClient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { SingleTestsResponse } from "@/Interfaces";
import { toast } from "sonner";

interface Answer {
  subjectId: string;
  questionId: string;
  selectedOptionIndex: number;
}

interface PostData {
  answers: Answer[];
  testID: string;
}

interface SubmitResponse {
  success: boolean;
  message: string;
  score: number;
}

export default function AttemptPage() {
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const submissionStarted = useRef(false);
  const timerReady = useRef(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const examID = searchParams.get("examID");
  const testID = searchParams.get("testID");

  const {
    data: testData,
    error: testError,
  } = useQuery({
    queryKey: ["test-details", examID, testID],
    enabled: Boolean(testID && examID),
    queryFn: async () => {
      const response = await apiClient.get<SingleTestsResponse>(
        `/user/tests/${examID}/${testID}`,
      );
      if (!response.test) throw new Error("Test not found.");
      return response.test;
    },
  });

  useEffect(() => {
    if (!testData) return;

    const duration = Number(testData.duration);
    if (!Number.isFinite(duration) || duration <= 0) {
      timerReady.current = false;
      toast.error("This test has an invalid duration and cannot be started.");
      return;
    }

    timerReady.current = true;
    setTimeLeft(duration * 60);
  }, [testData?.duration]);
  useEffect(() => {
    if (testError) {
      toast.error(
        testError instanceof Error ? testError.message : "Unable to load test.",
      );
    }
  }, [testError]);

  // ✅ Countdown Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev === null || prev <= 0 ? prev : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // const subjects = testData?.subjects ?? [];
  const subjects = useMemo(() => {
    return testData?.subjects ?? [];
  }, [testData?.subjects]);

  const currentSubject = subjects[currentSubjectIndex];
  const currentQuestion = currentSubject?.questions[currentQuestionIndex];

  // ✅ Generate unique key for each question
  const getKey = (subjectIdx: number, questionIdx: number) =>
    `${subjects[subjectIdx].id}-${questionIdx}`;

  // ✅ Select Answer
  const handleSelect = (option: string) => {
    const key = getKey(currentSubjectIndex, currentQuestionIndex);
    setSelectedAnswers((prev) => ({ ...prev, [key]: option }));
  };

  // ✅ Save & Next
  const handleSaveNext = () => {
    const isLastQuestionInSubject =
      currentQuestionIndex === currentSubject.questions.length - 1;
    const isLastSubject = currentSubjectIndex === subjects.length - 1;

    if (!isLastQuestionInSubject) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (!isLastSubject) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      toast.message(" Last question of last subject reached");
    }
  };

  // ✅ Save & Mark for Review
  const handleMark = () => {
    const key = getKey(currentSubjectIndex, currentQuestionIndex);
    setMarkedForReview((prev) => [...new Set([...prev, key])]);
    handleSaveNext();
  };

  // ✅ Previous
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubject = subjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex((prev) => prev - 1);
      setCurrentQuestionIndex(prevSubject.questions.length - 1);
    }
  };

  const submitTestMutation = useMutation({
    mutationFn: async (submitdata: PostData) => {
      const response = await apiClient.post<SubmitResponse>(
        "/user/tests/submit-test",
        submitdata,
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to submit test.");
      }
      return response;
    },
  });

  const handleSubmit = useCallback(
    async () => {
      if (!testData || !timerReady.current || submissionStarted.current) return;
      submissionStarted.current = true;

      try {
        // build payload
        const payload: {
          subjectId: string;
          questionId: string;
          selectedOptionIndex: number;
        }[] = [];

        for (const key in selectedAnswers) {
          const [subjectId, questionIdx] = key.split("-");
          const questionIndex = Number(questionIdx);

          const subject = subjects.find((sub) => sub.id === subjectId);
          const question = subject?.questions[questionIndex];

          if (!question) continue;

          const selectedOptionText = selectedAnswers[key];
          const selectedOptionIndex =
            question.options.indexOf(selectedOptionText);

          payload.push({
            subjectId,
            questionId: question.id,
            selectedOptionIndex,
          });
        }

        const finalTestID = testData.testID || testID || "";
        if (!finalTestID) {
          throw new Error("Test ID is missing. Unable to submit this test.");
        }
        // IMPORTANT: await the async call
        const apiResponse = await submitTestMutation.mutateAsync({
          answers: payload,
          testID: finalTestID, // you said backend expects testID
        });

        if (apiResponse.success) {
          toast.success("Test submitted successfully ");
        }
        await queryClient.invalidateQueries({ queryKey: ["test-results"] });

        // post-submit logic (only after API resolves)
        router.push("/thankyou");
      } catch (error) {
        submissionStarted.current = false;
        console.error("❌ Submit Failed:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to submit test.",
        );
      }
    },
    // include testData/testID in deps if used; otherwise stale values can be captured
    [
      subjects,
      selectedAnswers,
      // markedForReview,
      router,
      queryClient,
      testData,
      testID,
    ],
  );

  // auto submit
  useEffect(() => {
    if (timeLeft === 0 && testData) {
      handleSubmit(); // auto submit
    }
  }, [timeLeft, testData, handleSubmit]); // now handleSubmit included

  //  Auto-submit when user switches tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.message(
          "test submitted successfuly because you switched new tab",
        );
        handleSubmit(); // auto submit
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleSubmit]);

  if (!testData)
    return (
      <p
        role={testError ? "alert" : undefined}
        className={`p-6 text-center flex justify-center items-center font-semibold h-[100vh] ${
          testError ? "text-red-500" : "text-green-500"
        }`}
      >
        {testError instanceof Error ? testError.message : "Loading test..."}
      </p>
    );

  return (
    <div className="p-4 md:p-6 w-full mx-auto bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3 sticky top-0 bg-background border-b py-4 z-10">
        <h1 className="text-xl font-bold">
          {testData.title}{" "}
          <span className="text-primary">(ID: {testData.testID})</span>
        </h1>
        <span
          className={`font-mono text-lg px-3 py-1 rounded-lg shadow-sm ${
            timeLeft !== null && timeLeft <= 60
              ? "bg-red-500 text-white animate-pulse"
              : "bg-muted text-red-500"
          }`}
        >
          Time Left: {timeLeft === null ? "--:--" : formatTime(timeLeft)}
        </span>
      </header>

      {/* Subject Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {subjects.map((sub, i) => (
          <button
            key={sub.id}
            onClick={() => {
              setCurrentSubjectIndex(i);
              setCurrentQuestionIndex(0);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              i === currentSubjectIndex
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-gray-200"
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Palette */}
        <aside className="col-span-1 border border-border rounded-2xl shadow-sm p-4 bg-card">
          <h2 className="font-semibold mb-3 text-foreground">
            Question Palette ({currentSubject.name})
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {currentSubject.questions.map((_, i) => {
              const key = getKey(currentSubjectIndex, i);
              const isAnswered = selectedAnswers[key];
              const isMarked = markedForReview.includes(key);
              const isCurrent = i === currentQuestionIndex;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium border transition-colors
                    ${
                      isCurrent
                        ? "bg-primary text-white"
                        : isMarked
                          ? "bg-yellow-400 text-black"
                          : isAnswered
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                    }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-primary inline-block"></span>
              Current
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
              Answered
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block"></span>
              Marked
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-muted dark:bg-slate-700 border-[1px] dark:border-white inline-block"></span>
              Not Visited
            </p>
          </div>
        </aside>

        {/* Questions */}
        <main className="col-span-1 md:col-span-3 border border-border rounded-2xl shadow-sm p-6 bg-card">
          <h2 className="text-lg font-semibold mb-4">
            Q{currentQuestionIndex + 1}. {currentQuestion?.question}
          </h2>

          <div className="w-full flex justify-center items-center mb-4">
            {currentQuestion?.image && (
              <Image
                src={currentQuestion.image}
                alt="question"
                width={500}
                height={300}
                className="max-h-64 object-contain rounded-md shadow-sm"
              />
            )}
          </div>

          <div className="space-y-3">
            {currentQuestion?.options.map((opt, i) => {
              const key = getKey(currentSubjectIndex, currentQuestionIndex);
              return (
                <label
                  key={i}
                  className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 transition-colors ${
                    selectedAnswers[key] === opt
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${key}`}
                    className="h-4 w-4 accent-primary"
                    checked={selectedAnswers[key] === opt}
                    onChange={() => handleSelect(opt)}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-4 items-center">
              <button
                onClick={handleMark}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md"
              >
                Save & Mark
              </button>
              <button
                onClick={handleSaveNext}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Save & Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Submit */}
      <footer className="mt-10 flex justify-end">
        <button
          onClick={() => handleSubmit()}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-colors"
        >
          Submit Test
        </button>
      </footer>
    </div>
  );
}
