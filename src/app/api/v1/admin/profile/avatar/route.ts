import type { NextRequest } from "next/server";
import { MAX_AVATAR_BYTES, MAX_AVATAR_MB } from "@/constants/profile.constants";
import { withApiHandler } from "@/server/api/handler";
import { errors } from "@/server/api/errors";
import { assertTrustedOrigin } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { removeAdminAvatar, setAdminAvatar } from "@/server/admin/admin-profile.service";

// POST /api/v1/admin/profile/avatar — upload/replace the admin profile photo.
// Expects multipart/form-data with a single `file` field; validated server-side.
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw errors.badRequest("Expected a multipart form upload.");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw errors.badRequest("No image file was provided.");
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw errors.badRequest(`The image is too large. Maximum size is ${MAX_AVATAR_MB} MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { avatarUrl } = await setAdminAvatar(buffer);

  return success({ avatarUrl }, "Your profile photo has been updated.");
});

// DELETE /api/v1/admin/profile/avatar — remove the admin profile photo.
export const DELETE = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  await removeAdminAvatar();

  return success({ avatarUrl: null }, "Your profile photo has been removed.");
});
