"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="mt-4 bg-gray-600 dark:bg-white rounded-full p-1 text-secondary-foreground"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
