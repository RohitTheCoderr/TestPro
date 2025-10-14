"use client";
import { apiClient } from "@/lib/API/apiClient";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCurrentExam } from "@/lib/redux/slices/examdetailsSlice";
import { clearCurrentTest } from "@/lib/redux/slices/testSlice";
import Image from "next/image";
interface Question {
  question: string;
  options: string[];
  answer: string;
  image: string;
  questionID: string;
}

interface Subject {
  id: string;
  name: string;
  questions: Question[];
}

interface TestData {
  testID: string;
  title: string;
  duration: number;
  subjects: Subject[];
}

export default function AttemptPage() {
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds

  const router = useRouter();
  const dispatch = useDispatch();

  const currentExamdetails = useSelector(
    (state: RootState) => state.exam.currentExam
  );
  const testID = useSelector((state: RootState) => state.test.testID);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await apiClient.get(
          `/user/tests/${currentExamdetails?.ExamID}/${testID}`
        );
        const test = res?.test;
        setTestData(test);

        // ✅ Initialize timeLeft based on duration in minutes → seconds
        if (test?.duration) setTimeLeft(test.duration * 60);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };
    if (testID) fetchTest();
  }, [currentExamdetails?.ExamID, testID]);

  // ✅ Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ Auto Submit when time hits 0
  useEffect(() => {
    if (timeLeft === 0 && testData) {
      handleSubmit(true); // true = auto submit
    }
  }, [testData, timeLeft]);

  // ✅ Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!testData) return <p className="p-6 text-center">Loading test...</p>;

  const subjects = testData.subjects;
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
      console.log("✅ Last question of last subject reached");
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

  // ✅ Submit Test
  const handleSubmit = (auto = false) => {
    const total = subjects.reduce(
      (acc, subj) => acc + subj.questions.length,
      0
    );
    const totalAnswered = Object.keys(selectedAnswers).length;
    alert(
      auto
        ? `⏰ Time is over!\nAuto submitted.\nYou answered ${totalAnswered} out of ${total} questions.`
        : `✅ Test Submitted!\nYou answered ${totalAnswered} out of ${total} questions.`
    );
    console.log("answer", selectedAnswers);
    console.log("markedForReview", markedForReview);
    dispatch(clearCurrentExam());
    dispatch(clearCurrentTest());
    router.push("/thankyou");
  };

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
            timeLeft <= 60
              ? "bg-red-500 text-white animate-pulse"
              : "bg-muted text-red-500"
          }`}
        >
          Time Left: {formatTime(timeLeft)}
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
              <span className="w-4 h-4 rounded-full bg-muted inline-block"></span>
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
          onClick={() => handleSubmit(false)}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition-colors"
        >
          Submit Test
        </button>
      </footer>
    </div>
  );
}
