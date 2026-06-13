import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

// The dashboard reads live analytics from the API via a client component.
export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
