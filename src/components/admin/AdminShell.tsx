"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar onClose={() => setSidebarOpen(false)} open={sidebarOpen} pathname={pathname} />
      <div className="min-h-screen lg:pl-72">
        <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 xl:py-10">{children}</main>
      </div>
    </div>
  );
}
