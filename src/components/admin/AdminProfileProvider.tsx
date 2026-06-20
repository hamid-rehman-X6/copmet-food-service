"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import type { AdminProfile } from "@/types/admin.types";

type AdminProfileContextValue = {
  profile: AdminProfile | null;
  setProfile: (profile: AdminProfile) => void;
};

const AdminProfileContext = createContext<AdminProfileContextValue | null>(null);

// Loads the admin profile once for the admin area so the navbar and the settings
// profile tab share a single source of truth — editing one updates the other.
export function AdminProfileProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    let active = true;

    apiRequest<{ profile: AdminProfile }>("/api/v1/admin/profile")
      .then((response) => {
        if (active) setProfile(response.data.profile);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ profile, setProfile }), [profile]);

  return <AdminProfileContext.Provider value={value}>{children}</AdminProfileContext.Provider>;
}

export function useAdminProfile() {
  const context = useContext(AdminProfileContext);

  if (!context) {
    throw new Error("useAdminProfile must be used inside AdminProfileProvider.");
  }

  return context;
}

/** Single-letter fallback avatar for the admin when no photo is set. */
export function getAdminInitial(name: string | undefined) {
  return name?.trim().charAt(0).toUpperCase() || "A";
}
