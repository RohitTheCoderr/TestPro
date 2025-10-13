"use client";

import { Provider } from "react-redux";
import { persistor, store } from "./store";
import Startup from "./StartUp";
import { PersistGate } from "redux-persist/integration/react";
// import { store } from "@/lib/redux/store";
// import Startup from "@/lib/redux/StartUp";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Startup />
        {children}
      </PersistGate>
    </Provider>
  );
}
