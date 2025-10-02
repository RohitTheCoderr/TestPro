"use client";

import Link from "next/link";
import ThemeToggle from "../shared/mode";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-8 md:px-16 py-4 shadow-lg shadow-black bg-white dark:bg-gray-700 dark:text-white">
      <div className="text-primary dark:text-accent flex justify-center gap-2 items-center">
        <div className="">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
              fill="currentColor"
              fillRule="evenodd"
            />
            <path
              clipRule="evenodd"
              d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-primary dark:text-accent">TestPro</h1>
      </div>
      <nav className="space-x-6 text-black dark:text-white">
        <Link href="/" className="hover:text-primary ">
          Home
        </Link>
        <Link href="/tests" className="hover:text-primary">
          Tests
        </Link>
        <Link href="/pricing" className="hover:text-primary ">
          Pricing
        </Link>
        <Link
          href="/auth"
          className="bg-primary text-white px-4 py-[5px] rounded-[3px] hover:bg-accent transition"
        >
          Login
        </Link>

        <ThemeToggle/>
      </nav>
    </header>
  );
};

export default Header;
