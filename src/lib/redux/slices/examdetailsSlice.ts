// src/lib/redux/slices/examSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExamDetails {
  details: string[];
}

export interface Exam {
  ExamID: string;
  name: string;
  slug: string;
  categoryID: string;
  categoryName: string;
  examDetails: ExamDetails;
}

interface ExamState {
  currentExam: Exam | null;
}

const initialState: ExamState = {
  currentExam: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setCurrentExam: (state, action: PayloadAction<Exam>) => {
      state.currentExam = action.payload; // ✅ store full exam object
    },
    clearCurrentExam: (state) => {
      state.currentExam = null;
    },
  },
});

export const { setCurrentExam, clearCurrentExam } = examSlice.actions;
export default examSlice.reducer;
