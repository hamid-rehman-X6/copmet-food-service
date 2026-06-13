import { errors } from "@/server/api/errors";
import { envAdminUserId } from "@/server/auth/admin-auth.service";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { validateAvatarImage } from "@/server/profile/image-validation";
import {
  deleteAvatar,
  emailTakenByAnotherUser,
  getAvatar,
  getUserPasswordHash,
  updateUserPassword,
  updateUserProfile,
  upsertAvatar,
} from "@/server/profile/profile.repository";
import type { ChangePasswordInput, UpdateProfileInput } from "@/schemas/profile.schemas";
import type { AuthUser } from "@/types/auth.types";

// The admin account is environment-based and has no database row, so it cannot
// edit a profile. Guard every mutating operation against it.
function assertDatabaseUser(userId: string) {
  if (userId === envAdminUserId) {
    throw errors.forbidden("The admin account does not have an editable profile.");
  }
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser> {
  assertDatabaseUser(userId);

  if (await emailTakenByAnotherUser(input.email, userId)) {
    throw errors.conflict("That email address is already in use.");
  }

  const user = await updateUserProfile(userId, input);

  if (!user) {
    throw errors.notFound("Your account could not be found.");
  }

  return user;
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  assertDatabaseUser(userId);

  const currentHash = await getUserPasswordHash(userId);

  if (!currentHash) {
    throw errors.notFound("Your account could not be found.");
  }

  if (!(await verifyPassword(input.currentPassword, currentHash))) {
    throw errors.badRequest("Your current password is incorrect.");
  }

  await updateUserPassword(userId, await hashPassword(input.newPassword));
}

export async function setAvatar(userId: string, buffer: Buffer): Promise<{ avatarUpdatedAt: string }> {
  assertDatabaseUser(userId);

  const { mimeType } = validateAvatarImage(buffer);
  const avatarUpdatedAt = await upsertAvatar(userId, { mimeType, byteSize: buffer.length, data: buffer });

  return { avatarUpdatedAt };
}

export async function removeAvatar(userId: string): Promise<void> {
  assertDatabaseUser(userId);
  await deleteAvatar(userId);
}

export async function getAvatarForServing(userId: string) {
  return getAvatar(userId);
}
