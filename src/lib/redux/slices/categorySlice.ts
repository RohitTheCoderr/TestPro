import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryDetails {
  details: string;
  // otherdetails: string;
}

interface Category {
  categoryID: string;
  name: string;
  slug: string;
  categoryDetails?: CategoryDetails;
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
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
