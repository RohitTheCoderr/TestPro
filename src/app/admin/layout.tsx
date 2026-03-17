"use client";

import React, { useEffect } from "react";

import AdminSidebar from "@/components/adminReleted/sideBar/adminSideBar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { Loader } from "@/components/shared/loader";

function LayoutPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { token, user } = useAppSelector((state) => state.auth);
  const rehydrated = useAppSelector((state) => state._persist?.rehydrated);

  useEffect(() => {
    if (!rehydrated) return;

    // 1️⃣ Not logged in
    if (!token || !user) {
      router.replace("/auth");
      return;
    }

    // 2️⃣ Logged in but not admin
    if (user.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [token, user, rehydrated, router]);

  // 3️⃣ Prevent UI flash
  if (!rehydrated || !token || !user || user.role !== "admin") {
    return <Loader className=" flex justify-center items-center h-[90vh] " />; // or loader
  }

  return (
    // <div className=" w-full ">
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top bar */}
        <header className="h-16 bg-white shadow flex items-center px-6">
          <h1
            className={`text-2xl max-md:text-center w-full  font-semibold text-gray-800`}
          >
            Admin Dashboard
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 md:p-6 overflow-y-auto overflow-x-scroll">
          <div className="bg-white rounded shadow p-2 md:p-4">{children}</div>
        </main>
      </div>
    </div>
    // </div>
  );
}

export default LayoutPage;
