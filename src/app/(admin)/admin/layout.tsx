// Protected admin shell layout with sidebar and topbar.
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { ROUTES } from "@/constants/routes";
import { authOptions } from "@/lib/auth";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(ROUTES.adminLogin);
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-soft)]">
      <AdminSidebar />
      <section className="flex-1">
        <AdminTopbar title="Compet Food Service Admin" />
        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}
