"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage for web

import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import examReducer from "./slices/examdetailsSlice"; // ✅ your new slice
import testReducer from "./slices/testSlice"; // ✅ your new slice

// ✅ Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  exam: examReducer,
  test:testReducer
});

// ✅ Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "category", "exam", "test"], // only persist what you need
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ✅ Create persistor
export const persistor = persistStore(store);

// ✅ Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



// ####################
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import categoryReducer from './slices/categorySlice';

// // after refresh page

// function saveToLocalStorage(state: any) {
//   try {
//     localStorage.setItem("reduxState", JSON.stringify(state));
//   } catch (e) {
//     console.error("Could not save state", e);
//   }
// }

// function loadFromLocalStorage() {
//   try {
//     const serializedState = localStorage.getItem("reduxState");
//     if (serializedState === null) return undefined;
//     return JSON.parse(serializedState);
//   } catch (e) {
//     console.error("Could not load state", e);
//     return undefined;
//   }
// }

// const persistedState = typeof window !== "undefined" ? loadFromLocalStorage() : undefined;





// // end
//  export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     category: categoryReducer,
//   },
  
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
