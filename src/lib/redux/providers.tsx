"use client";

import { Provider } from "react-redux";
import { persistor, store } from "./store";
import Startup from "./StartUp";
import { PersistGate } from "redux-persist/integration/react";
import QueryProvider from "@/lib/react-query/QueryProvider";
// import { store } from "@/lib/redux/store";
// import Startup from "@/lib/redux/StartUp";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <Startup />
          {children}
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
}
