
import Link from "next/link";


interface PageProps {
  params: Promise<{ category: string; examType: string }>;
}

export default async function ExamTypeTests({ params }: PageProps) {
  const { category, examType } = await params;

  // Dummy data (later you can replace with API call)
  const tests = [
    { id: "test1", name: "SSC CGL Mock Test 1", type: "free", duration: "60 mins", marks: 200, difficulty: "Easy" },
    { id: "test2", name: "SSC CGL Mock Test 2", type: "paid", duration: "90 mins", marks: 300, difficulty: "Moderate" },
    { id: "test3", name: "SSC CGL Mock Test 3", type: "free", duration: "60 mins", marks: 200, difficulty: "Hard" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-background text-foreground">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">
        {category} → {examType} Tests
      </h1>

      {/* Grid of Tests */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <h2 className="font-semibold text-lg mb-2">{test.name}</h2>

              {/* Tag */}
              <span
                className={`inline-block mb-3 px-2 py-1 text-xs rounded-full ${
                  test.type === "free"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {test.type === "free" ? "Free Test" : "Paid Test"}
              </span>

              {/* Info */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>⏱ {test.duration}</p>
                <p>📊 {test.marks} Marks</p>
                <p>🎯 Difficulty: {test.difficulty}</p>
              </div>
            </div>

            {/* Button */}
            <Link
              href={`/tests/${category}/${examType}/${test.id}`}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition w-full text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
