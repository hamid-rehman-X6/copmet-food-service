import type { NextRequest } from "next/server";
import { MAX_AVATAR_BYTES, MAX_AVATAR_MB } from "@/constants/profile.constants";
import { withApiHandler } from "@/server/api/handler";
import { errors } from "@/server/api/errors";
import { assertTrustedOrigin } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { removeAvatar, setAvatar } from "@/server/profile/profile.service";

// POST /api/v1/profile/avatar
// Upload (or replace) the signed-in user's avatar. Expects multipart/form-data
// with a single `file` field. The image is validated server-side before storage.
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);

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

  // Reject oversized uploads before buffering the whole file into memory.
  if (file.size > MAX_AVATAR_BYTES) {
    throw errors.badRequest(`The image is too large. Maximum size is ${MAX_AVATAR_MB} MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { avatarUrl } = await setAvatar(session.userId, buffer);

  return success({ avatarUrl }, "Your profile photo has been updated.");
});

// DELETE /api/v1/profile/avatar — remove the current avatar (idempotent).
export const DELETE = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  await removeAvatar(session.userId);

  return success({ avatarUrl: null }, "Your profile photo has been removed.");
});
