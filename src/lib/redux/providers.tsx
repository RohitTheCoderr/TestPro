"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import Startup from "./StartUp";
// import { store } from "@/lib/redux/store";
// import Startup from "@/lib/redux/StartUp";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Startup />
      {children}
    </Provider>
  );
}
