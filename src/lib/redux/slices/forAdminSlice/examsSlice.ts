import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exams } from "../../../../Interfaces";
interface initialStateProps {
  examsList: Exams[];
}

const initialState: initialStateProps = {
  examsList: [],
};
const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    setExamsList: (state, action: PayloadAction<Exams[]>) => {
      state.examsList = action.payload;
    },
  },
});

export const { setExamsList } = examsSlice.actions;
export default examsSlice.reducer;
