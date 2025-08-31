import Link from "next/link";


interface PageProps {
  params: Promise<{ category: string; examType: string , testId: string}>;
}
export default async function TestDetails({ params }: PageProps) {
  const { category, examType, testId } = await params;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test {testId} - {examType.toUpperCase()}</h1>
      <p className="text-gray-600 mb-4">Duration: 60 mins | Questions: 100 | Max Marks: 200</p>

      <h2 className="font-semibold mb-2">Instructions:</h2>
      <ul className="list-disc pl-6 mb-6 text-sm text-gray-700 space-y-1">
        <li>Read all questions carefully before answering.</li>
        <li>You cannot pause or restart the test once started.</li>
        <li>Marks will be deducted for wrong answers.</li>
      </ul>

      <Link 
        href={`/tests/${category}/${examType}/${testId}/start`} 
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Start Test
      </Link>
    </div>
  );
}
