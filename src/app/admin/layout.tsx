"use client";

import Link from "next/link";
import React, { useState } from "react";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/adminReleted/sideBar/adminSideBar";

function LayoutPage({ children }: { children: React.ReactNode }) {
  const [flage, setFlage] = useState(false);
  const HandleThreedot = () => {
    console.log("call click");

    setFlage(!flage);
  };
  return (
    <div className="min-h-screen relative flex bg-gray-100 w-full overflow-auto">
      {/* Sidebar */}
      <AdminSidebar isOpen={flage} toggle={() => setFlage(!flage)} />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white shadow flex items-center px-6">
          <h1
            className={`text-2xl  font-semibold text-gray-800 ${flage ? "" : "ml-12"}`}
          >
            Admin Dashboard
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto ">
          <div className="bg-white rounded shadow p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default LayoutPage;
