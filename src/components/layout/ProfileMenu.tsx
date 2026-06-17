"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAvatarUrl, getInitials } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/common/Icon";
import type { AuthUser } from "@/types/auth.types";

type ProfileMenuProps = {
  user: AuthUser;
  onLogout: () => void;
};

// Avatar button in the navbar that opens a dropdown with Profile and Logout.
// Closes on outside click or Escape. Shows the uploaded photo when present,
// otherwise the user's initials.
export function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const avatarUrl = getAvatarUrl(user);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-border bg-surface-low text-sm font-bold text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {avatarUrl ? (
          <Image
            alt=""
            className="h-full w-full object-cover"
            height={40}
            src={avatarUrl}
            unoptimized
            width={40}
          />
        ) : (
          getInitials(user.firstName, user.lastName)
        )}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-lift)]"
          role="menu"
        >
          <div className="border-b border-border/60 px-4 py-3">
            <p className="truncate text-sm font-bold text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

          <Link
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-low"
            href="/profile"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <Icon className="h-5 w-5 text-muted-foreground" name="user" />
            Profile
          </Link>

          <Link
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-low"
            href="/orders"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <Icon className="h-5 w-5 text-muted-foreground" name="receipt" />
            My Orders
          </Link>

          <button
            className={cn(
              "flex w-full items-center gap-3 border-t border-border/60 px-4 py-3 text-left text-sm font-semibold text-error transition-colors hover:bg-error/5",
            )}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            role="menuitem"
            type="button"
          >
            <Icon className="h-5 w-5" name="logout" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
