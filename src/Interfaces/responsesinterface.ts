import { Category } from "./CategoryInterface";
import { Exams } from "./ExamInterface";
import { Test } from "./TestInterfaces";

// `/category/${categoryname}/exams`
export interface Examresponse {
  success: boolean;
  data: {
    category: Category;
    exams: Exams[];
  };
}

// `/category   +++ main page.tsx
export interface CategoryResponse {
  data: {
    categories: Category[];
  };
}

export interface SingleCategoryResponse {
  data: {
    category: Category;
  };
}

export interface TestsResponse {
  success: boolean;
  message: string;
  tests: Test[];
}

export interface SingleTestsResponse {
  success: boolean;
  message: string;
  test: Test;
}
