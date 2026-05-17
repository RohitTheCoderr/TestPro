"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Tags,
  FileText,
  ClipboardList,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Exams", href: "/admin/exams", icon: FileText },
    { label: "Tests", href: "/admin/tests", icon: ClipboardList },
  ];

  return (
    <>
      {/* Mobile Menu Button */}

      <button
        className=" absolute z-30 p-2 mt-2 ml-2 rounded-full
                   bg-gray-100 md:hidden hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-10 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "tween", duration: 0.3 }}
            className=" z-20 w-64 bg-gray-900 text-white
                       flex md:hidden flex-col absolute h-full  shadow-xl"
          >
            {/* Logo */}
            <div
              className="h-16 flex items-center justify-center
                            text-lg font-semibold border-b border-gray-800"
            >
              Admin Panel
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md
                      transition
                      ${
                        active
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          exit={{ x: -260 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="w-64 bg-gray-900 text-white
                     hidden md:flex flex-col shadow-xl"
        >
          {/* Logo */}
          <div
            className="h-16 flex items-center justify-center
                            text-lg font-semibold border-b border-gray-800"
          >
            Admin Panel
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md
                      transition
                      ${
                        active
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
