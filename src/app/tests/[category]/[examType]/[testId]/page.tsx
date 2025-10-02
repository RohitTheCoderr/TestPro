// app/tests/[category]/[examType]/[testId]/page.tsx
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string; examType: string; testId: string }>;
}

export default async function TestDetails({ params }: PageProps) {
  const { category, examType, testId } = await params;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen bg-background text-foreground">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {examType.toUpperCase()} - Test {testId}
      </h1>

      {/* Test Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Duration", value: "60 mins" },
          { label: "Questions", value: "100" },
          { label: "Max Marks", value: "200" },
          { label: "Attempts Allowed", value: "1" },
          { label: "Difficulty", value: "Moderate" },
          { label: "Category", value: category.toUpperCase() },
        ].map((info, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-card p-4 text-center shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{info.label}</p>
            <p className="text-lg font-semibold text-foreground">
              {info.value}
            </p>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-lg mb-3">Instructions</h2>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
          <li>Read all questions carefully before answering.</li>
          <li>You cannot pause or restart the test once started.</li>
          <li>Marks will be deducted for wrong answers.</li>
          <li>Ensure a stable internet connection during the test.</li>
          <li>
            Do not refresh or close the browser tab while the test is running.
          </li>
        </ul>
      </div>

      {/* Confirmation + Start */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            required
          />
          I have read and understood the instructions.
        </label>

        <Link
          href={`/tests/${category}/${examType}/${testId}/start`}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition"
        >
          Start Test
        </Link>
      </div>
    </div>
  );
}
