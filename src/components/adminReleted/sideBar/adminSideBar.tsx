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
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function AdminSidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Exams", href: "/admin/exams", icon: FileText },
    { label: "Tests", href: "/admin/tests", icon: ClipboardList },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          className=" absolute p-2 mt-2 ml-2 rounded-md
                   bg-gray-100 hover:bg-gray-200"
          onClick={toggle}
        >
          <Menu size={20} />
        </button>
      )}
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={toggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 md:hidden"
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
            className=" z-40 w-64 bg-gray-900 text-white
                       flex flex-col shadow-xl"
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
                    onClick={toggle}
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
    </>
  );
}
