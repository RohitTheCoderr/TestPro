import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Category {
  _id: string;
  name: string;
  slug: string;
  categoryDetails?: any;
  __v?: number;
}

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
