import { Category } from "@/Interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoriesState {
  categoriesList: Category[];
}

const initialState: CategoriesState = {
  categoriesList: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesList: (state, action: PayloadAction<Category[]>) => {
      state.categoriesList = action.payload;
    },
  },
});

export const { setCategoriesList } = categoriesSlice.actions;
export default categoriesSlice.reducer;
