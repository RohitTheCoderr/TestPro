"use client";
import { useEffect, useState } from "react";
import { MdModeNight } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
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
      className=" rounded-full text-secondary-foreground bg-gray-200 dark:text-black p-2 sm:py-1 "
    >
      {dark ? (
        <div className="flex gap-2 items-center">
          {" "}
          <MdLightMode className="" /> <span className="">Light</span>{" "}
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <MdModeNight className="" /> <span className="">Dark</span>
        </div>
      )}
    </button>
  );
}
