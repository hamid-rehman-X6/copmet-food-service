import {
  clearAdminAvatar,
  getAdminProfileRow,
  updateAdminAvatar,
  updateAdminDisplayName,
} from "@/server/admin/admin-profile.repository";
import { deleteImage, uploadImage } from "@/server/media/cloudinary";
import { validateAvatarImage } from "@/server/profile/image-validation";
import { env } from "@/server/config/env";
import type { UpdateAdminProfileInput } from "@/schemas/admin.schemas";
import type { AdminProfile } from "@/types/admin.types";

const ADMIN_AVATAR_FOLDER = "copmet/admin";
const DEFAULT_ADMIN_NAME = "Admin";

// Merge the stored profile (display name, avatar) with the env-based identity
// (the admin email always comes from configuration).
export async function getAdminProfile(): Promise<AdminProfile> {
  const row = await getAdminProfileRow();

  return {
    name: row?.displayName?.trim() || DEFAULT_ADMIN_NAME,
    email: env.adminEmail,
    avatarUrl: row?.avatarUrl ?? null,
  };
}

export async function updateAdminProfile(input: UpdateAdminProfileInput): Promise<AdminProfile> {
  await updateAdminDisplayName(input.name.trim());
  return getAdminProfile();
}

export async function setAdminAvatar(buffer: Buffer): Promise<{ avatarUrl: string }> {
  const { mimeType } = validateAvatarImage(buffer);

  const existing = await getAdminProfileRow();
  const uploaded = await uploadImage(buffer, mimeType, ADMIN_AVATAR_FOLDER);
  await updateAdminAvatar({ url: uploaded.url, publicId: uploaded.publicId });

  // Best-effort: remove the previous Cloudinary asset (ignore failures).
  if (existing?.avatarPublicId && existing.avatarPublicId !== uploaded.publicId) {
    await deleteImage(existing.avatarPublicId).catch(() => undefined);
  }

  return { avatarUrl: uploaded.url };
}

export async function removeAdminAvatar(): Promise<void> {
  const existing = await getAdminProfileRow();
  await clearAdminAvatar();

  if (existing?.avatarPublicId) {
    await deleteImage(existing.avatarPublicId).catch(() => undefined);
  }
}
