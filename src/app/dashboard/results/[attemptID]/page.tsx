"use client";

import { apiClient } from "@/lib/API/apiClient";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/redux/hooks";

interface ResultQuestion {
  questionID: string;
  question: string;
  options: string[];
  image: string | null;
  details: string;
  correctOptionIndex: number;
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
}

interface ResultSubject {
  subjectID: string;
  subjectName: string;
  questions: ResultQuestion[];
}

interface ResultDetails {
  attemptID: string;
  testTitle: string;
  examName: string;
  score: number;
  submittedAt: string;
  negativeMark: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  subjects: ResultSubject[];
}

interface ResultDetailsResponse {
  success: boolean;
  message: string;
  data: ResultDetails;
}

export default function ResultDetailsPage({
  params,
}: {
  params: { attemptID: string };
}) {
  const user = useAppSelector((state) => state.auth.user);
  const {
    data: result,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["test-result-details", user?.userId, params.attemptID],
    enabled: Boolean(params.attemptID && user?.userId),
    queryFn: async () => {
      const response = await apiClient.get<ResultDetailsResponse>(
          `/user/tests/testsresult/${params.attemptID}`,
        );
      if (!response.success) {
        throw new Error(response.message || "Failed to load test result.");
      }
      return response.data;
    },
  });

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground">
      <div className="container mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex h-9 items-center justify-center gap-2 rounded border border-primary bg-white px-4 text-sm font-medium text-black transition-colors hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        {loading ? (
          <p className="py-20 text-center text-muted-foreground">
            Loading result details...
          </p>
        ) : error ? (
          <section className="rounded-xl border border-destructive/30 bg-card p-6 text-center">
            <h1 className="text-xl font-semibold">Unable to load result</h1>
            <p className="mt-2 text-muted-foreground">
              {error instanceof Error ? error.message : "Unable to load result."}
            </p>
          </section>
        ) : result ? (
          <>
            <header className="mb-8 rounded-2xl border bg-card p-6">
              <p className="text-sm text-muted-foreground">{result.examName}</p>
              <h1 className="mt-1 text-2xl font-bold">{result.testTitle}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Submitted {new Date(result.submittedAt).toLocaleString()}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                {[
                  ["Score", result.score],
                  ["Correct", result.correct],
                  ["Wrong", result.wrong],
                  ["Attempted", `${result.attempted}/${result.totalQuestions}`],
                  ["Negative mark", result.negativeMark],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-3">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-lg font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </header>

            <div className="space-y-8">
              {result.subjects.map((subject) => (
                <section key={subject.subjectID}>
                  <h2 className="mb-4 text-xl font-semibold">
                    {subject.subjectName}
                  </h2>
                  <div className="space-y-4">
                    {subject.questions.map((question, questionIndex) => (
                      <article
                        key={question.questionID}
                        className="rounded-xl border bg-card p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold">
                            Question {questionIndex + 1}
                          </h3>
                          {question.isCorrect === null ? (
                            <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                              Not answered
                            </span>
                          ) : question.isCorrect ? (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-700">
                              <Check size={16} /> Correct
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-700">
                              <X size={16} /> Incorrect
                            </span>
                          )}
                        </div>

                        <p className="mt-3 whitespace-pre-wrap">
                          {question.question}
                        </p>
                        {question.image && (
                          <Image
                            src={question.image}
                            alt={`Image for question ${questionIndex + 1}`}
                            width={900}
                            height={500}
                            className="mt-4 h-auto max-h-96 w-auto max-w-full rounded-lg object-contain"
                          />
                        )}

                        <ol className="mt-4 space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isCorrect =
                              optionIndex === question.correctOptionIndex;
                            const isSelected =
                              optionIndex === question.selectedOptionIndex;

                            return (
                              <li
                                key={`${question.questionID}-${optionIndex}`}
                                className={`flex items-start gap-3 rounded-lg border p-3 ${
                                  isCorrect
                                    ? "border-green-600 bg-green-500/10"
                                    : isSelected
                                      ? "border-red-600 bg-red-500/10"
                                      : "border-border"
                                }`}
                              >
                                <span className="min-w-6 font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="flex-1 whitespace-pre-wrap">
                                  {option}
                                </span>
                                <span className="text-right text-xs font-medium">
                                  {isCorrect && (
                                    <span className="block text-green-700">
                                      Correct answer
                                    </span>
                                  )}
                                  {isSelected && (
                                    <span
                                      className={
                                        isCorrect
                                          ? "block text-green-700"
                                          : "block text-red-700"
                                      }
                                    >
                                      Your answer
                                    </span>
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ol>

                        {question.details && (
                          <div className="mt-4 rounded-lg bg-muted/50 p-4">
                            <h4 className="font-medium">Explanation</h4>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                              {question.details}
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
