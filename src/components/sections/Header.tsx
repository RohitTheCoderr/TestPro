"use client";

import Link from "next/link";
import ThemeToggle from "../shared/mode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { persistor } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";
import Image from "next/image";
import { FaThList } from "react-icons/fa";
import { useState } from "react";
const Header = () => {
  const [toggle, setToggle] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    alert("logout");
    localStorage.removeItem("authToken");
    persistor.purge(); // for clear all data from persits and redux
  };

  const handletoggle = () => {
    console.log("click", toggle);

    setToggle(!toggle);
  };

  return (
    <header className="flex justify-between w-full items-center px-8 md:px-16 py-4 shadow-md border-b-[1px] bg-white dark:bg-gray-700 dark:text-white">
      <div className="text-primary dark:text-accent flex justify-center gap-2 items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
        >
          <Image
            src="/logo.png"
            alt="TestPro Logo"
            width={64} // 16 * 4 = 64px (equivalent to h-16)
            height={64} // 16 * 4 = 64px (equivalent to w-16)
            priority // optional: preloads logo for faster first render
          />
          {/* <span>TestPro</span> */}
        </Link>
      </div>
      <nav className="space-x-6 max-sm:hidden text-black dark:text-white">
        <Link href="/" className="hover:text-primary ">
          Home
        </Link>
        <Link href="/tests" className="hover:text-primary">
          Tests
        </Link>

        {!token ? (
          <Link
            href="/auth"
            className="bg-primary text-white px-4 py-[5px] rounded-[3px] hover:bg-accent transition"
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              href="/dashboard"
              className="hover:text-primary w-full bg-muted py-1 px-2  "
            >
              dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded-[3px] hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}

        <ThemeToggle />
      </nav>

      <div className="sm:hidden">
        <div
          onClick={handletoggle}
          className="bg-muted relative rounded-full h-10 w-10 flex justify-center items-center m-auto mr-0  p-2 text-center hover:scale-105"
        >
          <FaThList />
        </div>
        {toggle ? (
          <div className=" bg-gray-50 dark:bg-gray-600 p-2 h-auto border-[1px] absolute z-30 top-20 right-0 border-gray-400 flex flex-col w-[10rem] gap-2">
            <Link
              href="/"
              className="hover:text-primary w-full  bg-muted py-1 px-2  "
            >
              Home
            </Link>
            <Link
              href="/tests"
              className="hover:text-primary w-full bg-muted py-1 px-2 "
            >
              Tests
            </Link>
            {!token ? (
              <Link
                href="/auth"
                className="bg-primary text-white px-2 py-[5px] rounded-[3px] hover:bg-accent transition"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-primary w-full bg-muted py-1 px-2"
                >
                  dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-2 py-1 rounded-[3px] hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

            <ThemeToggle />
          </div>
        ) : (
          ""
        )}
      </div>
    </header>
  );
};

export default Header;
