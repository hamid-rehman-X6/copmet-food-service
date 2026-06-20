import type { Metadata } from "next";
import { AdminProfileProvider } from "@/components/admin/AdminProfileProvider";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | Copmet Food Service",
    template: "%s | Copmet Admin",
  },
  description: "Manage Copmet Food Service operations.",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminProfileProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProfileProvider>
  );
}
