"use client";

import { apiClient } from "@/lib/API/apiClient";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🧩 Define updated TypeScript interfaces
interface SubjectWiseResult {
  subjectID: string;
  subjectName: string;
  totalQuestions: number; // ✅ total questions in subject
  attempted: number; // ✅ attempted by user
  correct: number;
  wrong: number;
  percentage: string;
}

interface TestResult {
  testID: string;
  testTitle: string;
  totalScore: number;
  submittedAt: string;
  subjectWiseResult: SubjectWiseResult[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TestResult[];
}

export default function DashboardPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  // ✅ Fetch test data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get<ApiResponse>("/user/tests/testsresult");
        console.log("Fetched Data:", res);

        if (res?.success && Array.isArray(res.data)) {
          setTestResults(res.data);
          if (res.data.length > 0) setSelectedTest(res.data[0]); // default to first test
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        console.error("Error fetching test results:", message);
        alert(message);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle card click
  const handleTestClick = (testID: string) => {
    const found = testResults.find((t) => t.testID === testID);
    if (found) setSelectedTest(found);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="container mx-auto flex-1 px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-card shadow-lg">
          <h1 className="mb-2 text-4xl font-bold lg:text-5xl">
            Welcome back, User!
          </h1>
          <p className="text-base leading-relaxed text-card-foreground">
            Your personalized dashboard to track progress and stay ahead.
          </p>
        </div>

        {/* ✅ All Test Cards */}
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Your Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground">
              Loading or no tests found...
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testResults.map((test) => (
                <div
                  key={test.testID}
                  onClick={() => handleTestClick(test.testID)}
                  className={`cursor-pointer rounded-lg border p-5 transition-all hover:shadow-md ${
                    selectedTest?.testID === test.testID
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <h3 className="text-lg font-bold">{test.testTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Total Score:{" "}
                    <span className="font-medium">{test.totalScore}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(test.submittedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Subject-wise Graph */}
        {selectedTest && (
          <div className="rounded-lg border border-border bg-card p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
              Subject Performance – {selectedTest.testTitle}
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {selectedTest.subjectWiseResult.map((sub) => (
                <div
                  key={sub.subjectID}
                  className="rounded-lg border border-border bg-card p-4 shadow-md"
                >
                  <h3 className="mb-3 text-lg font-semibold">
                    {sub.subjectName}
                  </h3>

                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        {
                          name: sub.subjectName,
                          Total: sub.totalQuestions,
                          Attempted: sub.attempted,
                          Correct: sub.correct,
                          Wrong: sub.wrong,
                          Accuracy: parseFloat(sub.percentage),
                        },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total" fill="#a3a3a3" />
                      <Bar dataKey="Attempted" fill="#f59e0b" />
                      <Bar dataKey="Correct" fill="#10b981" />
                      <Bar dataKey="Wrong" fill="#ef4444" />
                      <Bar dataKey="Accuracy" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>

            {/* <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={selectedTest.subjectWiseResult.map((sub) => ({
                  name: sub.subjectName,
                  Total: sub.totalQuestions,
                  Attempted: sub.attempted,
                  Correct: sub.correct,
                  Wrong: sub.wrong,
                  Accuracy: parseFloat(sub.percentage),
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#a3a3a3" />
                <Bar dataKey="Attempted" fill="#f59e0b" />
                <Bar dataKey="Correct" fill="#10b981" />
                <Bar dataKey="Wrong" fill="#ef4444" />
                <Bar dataKey="Accuracy" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer> */}
          </div>
        )}
      </main>
    </div>
  );
}

// "use client";

// import React from "react";

// export default function DashboardPage() {
//   return (
//     <div className="flex min-h-screen flex-col bg-background text-foreground">
//       {/* Main Content */}
//       <main className="container mx-auto flex-1 px-4 py-8 lg:px-8">
//         {/* Welcome Banner */}
//         <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-card shadow-lg">
//           <h1 className="mb-2 text-4xl font-bold lg:text-5xl">
//             Welcome back, Rohit!
//           </h1>
//           <p className="text-base leading-relaxed text-card-foreground">
//             Your personalized dashboard to track progress and stay ahead.
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {[
//             { title: "Tests Taken", value: "12" },
//             { title: "Accuracy %", value: "85%" },
//             { title: "Rank", value: "15/1200" },
//             { title: "Time Spent", value: "25h" },
//           ].map((stat, i) => (
//             <div
//               key={i}
//               className="rounded-lg border border-border bg-card p-5 text-center shadow-sm"
//             >
//               <p className="text-sm font-medium text-muted-foreground">
//                 {stat.title}
//               </p>
//               <p className="text-3xl font-bold text-card-foreground">
//                 {stat.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Continue Test + Leaderboard */}
//         <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
//           {/* Left Column */}
//           <div className="lg:col-span-2">
//             <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
//               Continue Test / Resume Attempt
//             </h2>
//             <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-card p-6 shadow-md md:flex-row md:items-center">
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold">Quantitative Aptitude - Mock Test 3</h3>
//                 <p className="mt-1 text-sm text-muted-foreground">
//                   Resume your attempt from question 25
//                 </p>
//                 <button className="mt-4 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground">
//                   Resume
//                 </button>
//               </div>
//               <div
//                 className="h-32 w-full flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat md:h-full md:w-48"
//                 style={{
//                   backgroundImage:
//                     "url('https://lh3.googleusercontent.com/aida-public/test-mock-thumb')",
//                 }}
//               />
//             </div>
//           </div>

//           {/* Leaderboard */}
//           <div className="lg:col-span-1">
//             <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
//               Leaderboard
//             </h2>
//             <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
//               <table className="w-full">
//                 <thead className="bg-muted">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
//                       Rank
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
//                       Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
//                       Score
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-border">
//                   {[
//                     { rank: 1, name: "Ethan Carter", score: 95 },
//                     { rank: 2, name: "Olivia Bennett", score: 92 },
//                     { rank: 3, name: "Noah Thompson", score: 90 },
//                     { rank: 4, name: "Ava Martinez", score: 88 },
//                     {
//                       rank: 15,
//                       name: "Sarah (You)",
//                       score: 85,
//                       highlight: true,
//                     },
//                   ].map((row, i) => (
//                     <tr
//                       key={i}
//                       className={
//                         row.highlight
//                           ? "bg-secondary font-bold text-primary"
//                           : ""
//                       }
//                     >
//                       <td className="px-4 py-3 text-sm">{row.rank}</td>
//                       <td className="px-4 py-3 text-sm">{row.name}</td>
//                       <td className="px-4 py-3 text-sm">{row.score}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Performance Analytics */}
//         <div className="mt-8">
//           <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
//             Performance Analytics
//           </h2>
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             <div className="rounded-lg border border-border bg-card p-6 shadow-md">
//               <h3 className="font-medium">Accuracy Over Time</h3>
//               <p className="text-3xl font-bold">
//                 85%{" "}
//                 <span className="text-base font-medium text-green-500">
//                   +5%
//                 </span>
//               </p>
//               <p className="text-sm text-muted-foreground">Last 3 Months</p>
//               <div className="mt-4 h-48 flex items-center justify-center text-muted-foreground">
//                 [Chart Placeholder]
//               </div>
//             </div>
//             <div className="rounded-lg border border-border bg-card p-6 shadow-md">
//               <h3 className="font-medium">Progress by Topic</h3>
//               <p className="text-3xl font-bold">
//                 70%{" "}
//                 <span className="text-base font-medium text-green-500">
//                   +10%
//                 </span>
//               </p>
//               <p className="text-sm text-muted-foreground">Overall</p>
//               <div className="mt-4 grid h-48 grid-cols-4 items-end gap-4">
//                 {["Algebra", "Calculus", "Geometry", "Statistics"].map(
//                   (topic, i) => (
//                     <div
//                       key={i}
//                       className="flex flex-col items-center justify-end"
//                     >
//                       <div className="h-32 w-full rounded-t-lg bg-secondary">
//                         <div className="h-full w-full rounded-t-lg bg-primary" />
//                       </div>
//                       <p className="mt-1 text-xs text-muted-foreground">
//                         {topic}
//                       </p>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
