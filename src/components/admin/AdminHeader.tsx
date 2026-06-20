import Image from "next/image";
import Link from "next/link";
import { brandName } from "@/constants/navigation";
import { Icon } from "@/components/common/Icon";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function AdminHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8 xl:px-10">
        <button aria-label="Open admin navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-primary hover:bg-surface-low lg:hidden" onClick={onMenuOpen} type="button">
          <Icon className="h-5 w-5" name="menu" />
        </button>

        <p className="heading-font hidden text-xl font-bold text-primary xl:block">{brandName}</p>

        <label className="relative ml-auto hidden w-full max-w-md sm:block">
          <span className="sr-only">Search admin panel</span>
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" name="search" />
          <input className="w-full rounded-full border border-border bg-surface-low py-3 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-card" placeholder="Search menu, orders, customers..." type="search" />
        </label>

        <div className="ml-auto flex items-center gap-1 sm:ml-0 sm:gap-2">
          <ThemeToggle />
          <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-surface-low hover:text-primary" type="button">
            <Icon className="h-5 w-5" name="bell" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-background bg-primary" />
          </button>
          <Link aria-label="Settings" className="hidden h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-surface-low hover:text-primary min-[380px]:grid" href="/admin/settings">
            <Icon className="h-5 w-5" name="settings" />
          </Link>
          <div className="ml-1 flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-2">
            <Image alt="Admin profile" className="h-8 w-8 rounded-full object-cover" height={32} src="/images/tracking/alex-img.png" width={32} />
            <span className="hidden text-xs font-semibold md:inline">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
