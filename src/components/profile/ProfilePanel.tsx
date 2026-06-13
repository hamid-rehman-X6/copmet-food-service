"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AvatarCard } from "@/components/profile/AvatarCard";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";

// Profile page body. Guards access (redirects guests to login) and lays out the
// avatar, account details, and password sections for the signed-in user.
export function ProfilePanel() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/profile");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface-low px-6 py-20 text-center text-sm text-muted-foreground">
        Loading your profile...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <AvatarCard user={user} />
      <ProfileDetailsForm user={user} />
      <PasswordForm />
    </div>
  );
}
