

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';

// after refresh page

function saveToLocalStorage(state: any) {
  try {
    localStorage.setItem("reduxState", JSON.stringify(state));
  } catch (e) {
    console.error("Could not save state", e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load state", e);
    return undefined;
  }
}

const persistedState = typeof window !== "undefined" ? loadFromLocalStorage() : undefined;





// end
 export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
  
});

// export default store
// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
