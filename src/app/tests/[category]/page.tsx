import { Button } from "@/components/ui/button"; // adjust import path if needed
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 📌 Reusable Card Component
type TestCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  category: string;
  examType: string;
  // onClick?: () => void;
};

const TestCard: React.FC<TestCardProps> = ({
  title,
  description,
  buttonLabel,
  category,
  examType,
  // onClick,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col justify-between bg-white">
      <div>
        {/* <h3 className="text-xl font-semibold text-gray-900">{title}</h3> */}
        <h3 className="text-xl font-semibold text-gray-900">{examType}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="mt-4 flex gap-4">
        {/* <Button size="lg" onClick={onClick}></Button> */}
        <Link
          href={`/tests/${category}/${examType}`}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-sm"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
};



interface PageProps {
  params: Promise<{ category: string; }>;
}

// 📌 Tests Page
export default async function TestsPage({  params,}: PageProps) {
  const { category } = await params;

   // Example fetch from backend
  // const res = await fetch(`${process.env.API_URL}/tests/${category}/${examType}`);
  // const tests = await res.json();

  const examType = [
    {
      category: category,
      examType: `${category =="SSC" ? "MTS": "NTPC" }`,
      description:
        "Sharpen your logical thinking and problem-solving skills with real exam patterns.",
      buttonLabel: "Start Test",
    },
    {
      category: category,
      examType: `${category =="SSC" ? "CHSL": "GROUP-D" }`,
      description:
        "Evaluate your coding, data structures, and algorithm knowledge.",
      buttonLabel: "Take Test",
    },
    {
      category: category,
      examType:`${category =="SSC" ? "GCL": "TTE" }`,
      description:
        "Prepare for real-world interviews with timed mock interview sessions.",
      buttonLabel: "Try Now",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900">select your Tests</h1>
        <p className="mt-3 text-lg text-gray-600">
          Improve your skills by taking practice tests designed for students and
          job seekers.
        </p>
      </div>

      {/* Test Cards Grid */}

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examType.map((test, idx) => (
          <TestCard
            key={idx}
            title={test.category}
            description={test.description}
            buttonLabel={test.buttonLabel}
            category={test.category}
            examType={test.examType}
            // onClick={() => alert(`${test.category} started!`)} // you can link instead
          />
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Ready to challenge yourself?
        </h2>
        <div className="mt-4 flex justify-center gap-4">
          <Button size="lg">Start Free Test</Button>
          <Button variant="outline" size="lg">
            Explore More Tests
          </Button>
        </div>
      </div>
    </main>
  );
}
