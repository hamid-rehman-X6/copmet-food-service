// Public storefront header with responsive navigation.
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function PublicHeader() {
  return (
    <header className="border-b border-[var(--color-hairline)] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="text-lg font-semibold" href={ROUTES.home}>
          Compet Food Service
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href={ROUTES.products}>Products</Link>
          <Link href={ROUTES.categories}>Categories</Link>
        </nav>
      </div>
    </header>
  );
}
