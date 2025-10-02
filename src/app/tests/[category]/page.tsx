import { Button } from "@/components/ui/button";
import Link from "next/link";

// 📌 Reusable Card Component
type TestCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  category: string;
  examType: string;
};

const TestCard: React.FC<TestCardProps> = ({
  description,
  buttonLabel,
  category,
  examType,
}) => {
  return (
    <div className="rounded-2xl border border-border shadow-sm p-6 flex flex-col justify-between bg-card hover:shadow-md transition">
      <div>
        <h3 className="text-xl font-semibold text-foreground">{examType}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          href={`/tests/${category}/${examType}`}
          className="w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-accent-foreground text-sm transition"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
};

interface PageProps {
  params: Promise<{ category: string }>;
}

// 📌 Tests Page
export default async function TestsPage({ params }: PageProps) {
  const { category } = await params;

  // Dummy exam types (replace with API)
  const examTypes = [
    {
      category,
      examType: category === "SSC" ? "MTS" : "NTPC",
      description:
        "Sharpen your logical thinking and problem-solving skills with real exam patterns.",
      buttonLabel: "Start Test",
    },
    {
      category,
      examType: category === "SSC" ? "CHSL" : "GROUP-D",
      description:
        "Evaluate your accuracy, reasoning, and comprehension with curated mock tests.",
      buttonLabel: "Take Test",
    },
    {
      category,
      examType: category === "SSC" ? "CGL" : "TTE",
      description:
        "Prepare for competitive exams with detailed solutions and performance tracking.",
      buttonLabel: "Try Now",
    },
  ];

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Select Your {category} Tests
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Improve your skills by taking practice tests designed for students and job seekers.
        </p>
      </div>

      {/* Test Cards Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {examTypes.map((test, idx) => (
          <TestCard
            key={idx}
            title={test.category}
            description={test.description}
            buttonLabel={test.buttonLabel}
            category={test.category}
            examType={test.examType}
          />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground">
          Ready to challenge yourself?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Start with a free test or explore more paid mock tests for in-depth practice.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button size="lg">Start Free Test</Button>
          <Button variant="outline" size="lg">
            Explore More Tests
          </Button>
        </div>
      </div>
    </main>
  );
}
