import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string; examType: string }>;
}

export default async function ExamTypeTests({ params }: PageProps) {
  const { category, examType } =await params;

  // HERE WE CAN CALL BACKEND WITH category, examType SO THAT DATA(TEST QUESTING) COME ACCODIND TO CATEGORY

  // Dummy data
  const tests = [
    { id: "test1", name: "SSC CGL Mock Test 1", type: "free" },
    { id: "test2", name: "SSC CGL Mock Test 2", type: "paid" },
    { id: "test3", name: "SSC CGL Mock Test 3", type: "free" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {category} → {examType} Tests
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div key={test.id} className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold text-lg">{test.name}</h2>
            <p className="text-sm text-gray-500 mb-3">
              {test.type === "free" ? "Free Test" : "Paid Test"}
            </p>
            <Link 
              href={`/tests/${category}/${examType}/${test.id}`} 
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-sm"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
