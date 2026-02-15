"use client";

import React from "react";

import AdminSidebar from "@/components/adminReleted/sideBar/adminSideBar";

function LayoutPage({ children }: { children: React.ReactNode }) {
  return (
    // <div className=" w-full ">
    <div className="flex bg-gray-50 overflow-scroll min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col w-full">
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
