"use client";

import { useState, useEffect } from "react";
import SideNav from "@/app/ui/my-page/sidenav";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      {/* Toggle button for small screens */}
      <button
        className="md:hidden p-2 fixed top-4 left-4 bg-sky-300 text-white rounded"
        onClick={() => setIsSidebarOpen(true)}
      >
        Menu
      </button>

      {/* Sidebar visible on larger screens and as modal on small screens */}
      <div
        className={`${
          isSidebarOpen
            ? "fixed inset-0 bg-gray-800 bg-opacity-50 z-10"
            : "hidden"
        } md:flex md:w-64 md:static`}
      >
        <div
          className={`${
            isSidebarOpen ? "block bg-white p-6 h-full" : "md:block md:static"
          }`}
        >
          {/* Close button for the modal on small screens */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </button>
          <SideNav setIsSidebarOpen={setIsSidebarOpen} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 pt-16  md:pt-12 md:overflow-y-auto md:p-12 bg-gray-50 border border-gray-300">
        {children}
      </div>
    </div>
  );
}
