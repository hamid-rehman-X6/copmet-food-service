"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AvatarCard } from "@/components/profile/AvatarCard";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

// Renders the profile sections once the session is confirmed. `user` is always
// present here because RequireAuth only renders this when authenticated.
function ProfileContent() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AvatarCard user={user} />
      <ProfileDetailsForm user={user} />
      <PasswordForm />
    </div>
  );
}

// Profile is a protected route. RequireAuth handles the session/redirect, and
// shows the profile skeleton while it resolves.
export function ProfilePanel() {
  return (
    <RequireAuth fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </RequireAuth>
  );
}
