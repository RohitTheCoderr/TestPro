"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { setAuthToken } from "./slices/authSlice";

export default function Startup() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(setAuthToken(token));
    }
  }, [dispatch]);

  return null; // it doesn't render anything, just runs on load
}
