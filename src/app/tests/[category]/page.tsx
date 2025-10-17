"use client";

import { useEffect, useState, use } from "react";
import { apiClient } from "@/lib/API/apiClient";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCurrentExam } from "@/lib/redux/slices/examdetailsSlice";
// import type { Exam } from "@/lib/redux/slices/examdetailsSlice.ts";
import { ExamDetails, Examresponse, Exams } from "@/Interfaces";
import { useRouter } from "next/navigation";

// Define the type for selected exam
type ExamSelect = {
  categoryID: string;
  categoryName: string;
  name: string;
  slug: string;
  examDetails: ExamDetails;
  ExamID: string;
};

// Props for TestCard
type ExamCardProps = {
  categoryID: string;
  categoryName: string;
  name: string;
  slug: string;
  examDetails: ExamDetails;
  ExamID: string;
  onSelect?: (exam: ExamSelect) => void; // strongly typed
};

const TestCard: React.FC<ExamCardProps> = ({
  categoryID,
  categoryName,
  name,
  slug,
  examDetails,
  ExamID,
  onSelect,
}) => (
  <div className="rounded-2xl border border-border shadow-sm p-6 flex flex-col justify-between bg-card hover:shadow-md transition">
    <div>
      <h3 className="text-xl font-semibold text-foreground">{name}</h3>
      {examDetails.details.length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {examDetails.details[0]}
        </p>
      )}
    </div>
    <div className="mt-4 flex gap-4">
      <Link
        href={`/tests/${categoryName}/${slug}`}
        className="w-full text-center px-4 py-2 bg-primary text-white rounded-full hover:bg-accent hover:text-accent-foreground text-sm transition"
        onClick={
          () =>
            onSelect?.({
              ExamID,
              name,
              slug,
              categoryID,
              categoryName,
              examDetails,
            })
          // onSelect({
          //   ExamID,
          //   name,
          //   slug,
          //   categoryID,
          //   categoryName,
          //   examDetails,
          // })
        } // ✅ pass full exam object
      >
        Explore {name} Tests
      </Link>
    </div>
  </div>
);

export default function TestsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // unwrap promise
  const { category } = use(params);
  const dispatch = useDispatch();
  const [examTypes, setExamTypes] = useState<ExamCardProps[]>([]);
  const router = useRouter();
  const decodedCategory = decodeURIComponent(category);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await apiClient.get<Examresponse>(
          `/category/${decodedCategory}/exams`
        );
        const categoryName = res.data.category.name;
        const exams: ExamCardProps[] = res.data.exams.map((exam: Exams) => ({
          name: exam.name,
          slug: exam.slug,
          ExamID: exam.ExamID,
          categoryName: categoryName,
          categoryID: exam.categoryID,
          examDetails: exam.examDetails || { details: [] },
        }));

        setExamTypes(exams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    if (decodedCategory) fetchExamData();
  }, [decodedCategory]);

  const handleExamSelect = (exam: Exams) => {
    dispatch(setCurrentExam(exam));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm">
          <span className="uppercase text-primary">{decodedCategory}</span> Exams
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Sharpen your skills with practice tests specifically designed for{" "}
          <span className="font-semibold">{decodedCategory}</span>. Attempt
          these tests to improve your knowledge and boost your confidence.
        </p>
      </div>

      {/* Exam Cards */}
      {examTypes.length !== 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {examTypes.map((exam) => (
            <TestCard key={exam.ExamID} {...exam} onSelect={handleExamSelect} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-20 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto text-center">
          <svg
            className="w-24 h-24 text-gray-400 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-4 2h8m-4-4v4"
            />
          </svg>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">
            No Exams Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Currently, there are no exams available in{" "}
            <span className="font-semibold text-primary uppercase">
              {decodedCategory}
            </span>
            .
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You can explore other categories or check back later for updates.
          </p>
          <button
            onClick={() => router.push("/tests")}
            className="mt-4 px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300"
          >
            Explore Other Categories
          </button>
        </div>
      )}

      {/* Optional CTA Section */}
      <div className="mt-20 text-center max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl max-sm:p-5 p-8 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          Ready to challenge yourself?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Start with a free test or explore more paid mock tests for in-depth
          practice.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-colors">
            Start Free Test
          </button>
          <button className="px-6 py-3 rounded-lg border border-green-500 text-green-500 font-semibold shadow hover:bg-green-50 transition-colors">
            Explore More Tests
          </button>
        </div>
      </div>
    </main>

    // <main className="min-h-screen bg-background py-12 px-6">
    //   <div className="max-w-5xl mx-auto text-center">
    //     <h1 className="text-4xl font-bold text-foreground ">
    //       Select Your{" "}
    //       <span className="font-bold text-primary uppercase">
    //         {decodedCategory}
    //       </span>{" "}
    //       Categories
    //     </h1>
    //     <p className="mt-3 text-lg text-muted-foreground">
    //       Improve your skills by taking practice tests designed for students and
    //       job seekers.
    //     </p>
    //   </div>
    //   {examTypes.length !== 0 ? (
    //     <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    //       {examTypes.map((exam) => (
    //         <TestCard key={exam.ExamID} {...exam} onSelect={handleExamSelect} />
    //       ))}
    //     </div>
    //   ) : (
    //     <div className="mt-16 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto text-center">
    //       {/* Optional icon */}
    //       <svg
    //         className="w-20 h-20 text-gray-400 animate-bounce"
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         stroke="currentColor"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M9 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-4 2h8m-4-4v4"
    //         />
    //       </svg>

    //       <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">
    //         No Exams Found
    //       </h3>

    //       <p className="text-gray-500 dark:text-gray-400 text-lg">
    //         Currently, there are no exams available in{" "}
    //         <span className="font-semibold text-primary uppercase">
    //           {decodedCategory}
    //         </span>
    //         .
    //       </p>

    //       <p className="text-gray-500 dark:text-gray-400 text-sm">
    //         You can explore other categories or check back later for updates.
    //       </p>

    //       <button
    //         onClick={() => router.push("/category")}
    //         className="mt-4 px-6 py-3 rounded-lg bg-primary text-white font-semibold shadow-md hover:bg-primary/90 transition-colors"
    //       >
    //         Explore Other Categories
    //       </button>
    //     </div>
    //   )}

    //   {/* <div className="mt-16 text-center max-w-4xl mx-auto">
    //     <h2 className="text-2xl font-semibold text-foreground">
    //       Ready to challenge yourself?
    //     </h2>
    //     <p className="mt-2 text-muted-foreground">
    //       Start with a free test or explore more paid mock tests for in-depth
    //       practice.
    //     </p>
    //     <div className="mt-6 flex justify-center gap-4">
    //       <Button size="lg">Start Free Test</Button>
    //       <Button variant="outline" size="lg">
    //         Explore More Tests
    //       </Button>
    //     </div>
    //   </div> */}
    // </main>
  );
}
