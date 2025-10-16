// @/Interfaces.ts

// Question Interface
export interface Question {
  question: string;
  options: string[];
  answer: number; // index of correct option
  details: string;
  image: string | null;
  id: string;
  questionID: string;
}

// Subject Interface
export interface Subject {
   id: string;
  name: string;
  questions: Question[];
}



export interface Test {
  title: string;
  type: string;       // e.g., "free" or "paid"
  duration: number;   // in minutes
  price: number;      // 0 for free, >0 for paid
  examID: string;
  testID: string;
  id?: string;
  subjects?: Subject[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCardProps {
  title: string;
  type: string;
  duration: number|string;
  price?: number|string;
  testID: string;
  examID: string;
  categoryName?: string;
  examName?: string;
  onSelect?: (id: string) => void;
};


// export interface TestCardProps {
//   title: string;
//   type: string;
//   duration: number;
//   price: number;
//   testID: string;          // required
//   examID?: string;
//   categoryName?: string;
//   examName: string;
//   onSelect?: (id: string) => void;
// }
