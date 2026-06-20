import { errors } from "@/server/api/errors";
import { envAdminUserId } from "@/server/auth/admin-auth.service";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { deleteImage, uploadImage } from "@/server/media/cloudinary";
import { validateAvatarImage } from "@/server/profile/image-validation";
import {
  deleteAvatar,
  emailTakenByAnotherUser,
  getAvatar,
  getDeliveryDefaults,
  getUserPasswordHash,
  updateDeliveryDefaults,
  updateUserPassword,
  updateUserProfile,
  upsertAvatar,
} from "@/server/profile/profile.repository";
import type { ChangePasswordInput, DeliveryDefaultsInput, UpdateProfileInput } from "@/schemas/profile.schemas";
import type { AuthUser } from "@/types/auth.types";
import type { DeliveryDefaults } from "@/types/profile.types";

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

const AVATAR_FOLDER = "copmet/avatars";

export async function setAvatar(userId: string, buffer: Buffer): Promise<{ avatarUrl: string }> {
  assertDatabaseUser(userId);

  const { mimeType } = validateAvatarImage(buffer);

  // Remember the existing asset so it can be cleaned up after a successful swap.
  const existing = await getAvatar(userId);

  const uploaded = await uploadImage(buffer, mimeType, AVATAR_FOLDER);
  const avatarUrl = await upsertAvatar(userId, { imageUrl: uploaded.url, publicId: uploaded.publicId });

  // Best-effort: drop the previous Cloudinary asset (ignore failures).
  if (existing && existing.publicId !== uploaded.publicId) {
    await deleteImage(existing.publicId).catch(() => undefined);
  }

  return { avatarUrl };
}

export async function removeAvatar(userId: string): Promise<void> {
  assertDatabaseUser(userId);

  const publicId = await deleteAvatar(userId);
  if (publicId) {
    await deleteImage(publicId).catch(() => undefined);
  }
}

const EMPTY_DELIVERY_DEFAULTS: DeliveryDefaults = {
  phone: null,
  address: null,
  city: null,
  postalCode: null,
  instructions: null,
};

// Treat blank input as "cleared" so saving an empty field removes the value.
function normalize(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export async function getDeliveryDefaultsService(userId: string): Promise<DeliveryDefaults> {
  // The env admin has no DB row; return empty defaults instead of querying.
  if (userId === envAdminUserId) {
    return EMPTY_DELIVERY_DEFAULTS;
  }

  return getDeliveryDefaults(userId);
}

export async function saveDeliveryDefaults(
  userId: string,
  input: DeliveryDefaultsInput,
): Promise<DeliveryDefaults> {
  assertDatabaseUser(userId);

  const saved = await updateDeliveryDefaults(userId, {
    phone: normalize(input.phone),
    address: normalize(input.address),
    city: normalize(input.city),
    postalCode: normalize(input.postalCode),
    instructions: normalize(input.instructions),
  });

  if (!saved) {
    throw errors.notFound("Your account could not be found.");
  }

  return saved;
}
