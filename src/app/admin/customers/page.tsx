import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin/customers/AdminCustomers";

export const metadata: Metadata = {
  title: "Customers",
};

// Customers are read-only in the admin panel (view accounts and their orders),
// handled by the interactive client-side AdminCustomers component.
export default function AdminCustomersPage() {
  return <AdminCustomers />;
}
