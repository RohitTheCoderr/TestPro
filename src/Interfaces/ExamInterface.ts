export interface ExamDetails {
  details: string[];
  negativeMark: number;
  permark: number;
  totalQuestion: number;
  totalmarks: number;
  otherdetails: string;
  _id: string;
}

export interface Exams {
  name: string;
  slug: string;
  examDetails: ExamDetails;
  ExamID: string;
  categoryID: string;
  id?: string;
  categoryName?: string;
}
