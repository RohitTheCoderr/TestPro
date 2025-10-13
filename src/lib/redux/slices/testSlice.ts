// src/lib/redux/slices/testSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TestState {
  testID: string | null;
}

const initialState: TestState = {
  testID: null,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setCurrentTest: (state, action: PayloadAction<string>) => {
      state.testID = action.payload; 
    },
    clearCurrentTest: (state) => {
      state.testID = null;
    },
  },
});

export const { setCurrentTest, clearCurrentTest } = testSlice.actions;
export default testSlice.reducer;