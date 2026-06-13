import type { Metadata } from "next";
import { AdminSettings } from "@/components/admin/settings/AdminSettings";

export const metadata: Metadata = {
  title: "Store Settings",
};

// Store configuration (currency, delivery pricing) edited via a client form.
export default function AdminSettingsPage() {
  return <AdminSettings />;
}
