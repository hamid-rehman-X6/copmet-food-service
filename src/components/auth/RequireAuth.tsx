"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type RequireAuthProps = {
  children: React.ReactNode;
  /** Shown while the session is being resolved or before the redirect runs. */
  fallback?: React.ReactNode;
};

// Client-side guard for protected customer pages (checkout, profile). It waits
// for the session to resolve, then either renders the page or redirects guests
// to login with a `next` param so they return here after signing in.
//
// We guard on the client (not middleware) so an expired-but-refreshable session
// is transparently restored by the API client instead of being bounced to login.
export function RequireAuth({ children, fallback = null }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  // While resolving the session, or during the redirect for a guest, show the
  // fallback rather than flashing protected content.
  if (loading || !user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
