"use client";

import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Main Content */}
      <main className="container mx-auto flex-1 px-4 py-8 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-card shadow-lg">
          <h1 className="mb-2 text-4xl font-bold lg:text-5xl">
            Welcome back, Rohit!
          </h1>
          <p className="text-base leading-relaxed text-card-foreground">
            Your personalized dashboard to track progress and stay ahead.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Tests Taken", value: "12" },
            { title: "Accuracy %", value: "85%" },
            { title: "Rank", value: "15/1200" },
            { title: "Time Spent", value: "25h" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-5 text-center shadow-sm"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Continue Test + Leaderboard */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
              Continue Test / Resume Attempt
            </h2>
            <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-card p-6 shadow-md md:flex-row md:items-center">
              <div className="flex-1">
                <h3 className="text-lg font-bold">Quantitative Aptitude - Mock Test 3</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Resume your attempt from question 25
                </p>
                <button className="mt-4 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground">
                  Resume
                </button>
              </div>
              <div
                className="h-32 w-full flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat md:h-full md:w-48"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/test-mock-thumb')",
                }}
              />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
              Leaderboard
            </h2>
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { rank: 1, name: "Ethan Carter", score: 95 },
                    { rank: 2, name: "Olivia Bennett", score: 92 },
                    { rank: 3, name: "Noah Thompson", score: 90 },
                    { rank: 4, name: "Ava Martinez", score: 88 },
                    {
                      rank: 15,
                      name: "Sarah (You)",
                      score: 85,
                      highlight: true,
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={
                        row.highlight
                          ? "bg-secondary font-bold text-primary"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 text-sm">{row.rank}</td>
                      <td className="px-4 py-3 text-sm">{row.name}</td>
                      <td className="px-4 py-3 text-sm">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">
            Performance Analytics
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <h3 className="font-medium">Accuracy Over Time</h3>
              <p className="text-3xl font-bold">
                85%{" "}
                <span className="text-base font-medium text-green-500">
                  +5%
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Last 3 Months</p>
              <div className="mt-4 h-48 flex items-center justify-center text-muted-foreground">
                [Chart Placeholder]
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 shadow-md">
              <h3 className="font-medium">Progress by Topic</h3>
              <p className="text-3xl font-bold">
                70%{" "}
                <span className="text-base font-medium text-green-500">
                  +10%
                </span>
              </p>
              <p className="text-sm text-muted-foreground">Overall</p>
              <div className="mt-4 grid h-48 grid-cols-4 items-end gap-4">
                {["Algebra", "Calculus", "Geometry", "Statistics"].map(
                  (topic, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-end"
                    >
                      <div className="h-32 w-full rounded-t-lg bg-secondary">
                        <div className="h-full w-full rounded-t-lg bg-primary" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {topic}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
