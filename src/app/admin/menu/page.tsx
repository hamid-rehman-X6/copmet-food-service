import type { Metadata } from "next";
import { AdminCatalog } from "@/components/admin/catalog/AdminCatalog";

export const metadata: Metadata = {
  title: "Frozen Catalog",
};

// Catalog management is fully interactive (search, filter, paginate, CRUD), so
// the page delegates to the client-side AdminCatalog component.
export default function AdminMenuPage() {
  return <AdminCatalog />;
}
