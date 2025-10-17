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
      className="mt-4 rounded-full text-secondary-foreground bg-gray-300 p-2 group"
    >
      {dark ?(<div className="flex gap-2 items-center"> <MdLightMode className="group-hover:scale-150"/> <span className="sm:hidden">Light</span> </div>) : (<div className="flex gap-2 items-center"><MdModeNight className="group-hover:scale-150"/> <span className="sm:hidden">Dark</span></div>)}
    </button>
  );
}
