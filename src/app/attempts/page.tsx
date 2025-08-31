// app/attempts/page.tsx
"use client";
import Link from "next/link";

export default function AttemptsHistoryPage() {
  const attempts = [
    { id: "a1", title: "SSC CGL Mock 1", score: "140 / 200" },
    { id: "a2", title: "Railway NTPC Mock 2", score: "110 / 200" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">My Past Attempts</h1>
      <div className="space-y-4">
        {attempts.map((att) => (
          <Link
            key={att.id}
            href={`/tests/${att.id}/result`}
            className="block p-4 border rounded-2xl shadow bg-white hover:shadow-md transition"
          >
            <h2 className="font-semibold">{att.title}</h2>
            <p className="text-gray-600">Score: {att.score}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
