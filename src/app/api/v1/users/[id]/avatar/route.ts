import { NextResponse, type NextRequest } from "next/server";
import { withApiHandler } from "@/server/api/handler";
import { errors } from "@/server/api/errors";
import { getAvatarForServing } from "@/server/profile/profile.service";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/v1/users/:id/avatar
// Serve a user's avatar image bytes. Public and cacheable; the client appends a
// `?v=<avatarUpdatedAt>` cache-buster so the response can be cached safely.
export const GET = withApiHandler(async (_request: NextRequest, context: RouteContext) => {
  const { id } = await context.params;
  const avatar = await getAvatarForServing(id);

  if (!avatar) {
    throw errors.notFound("This user has no avatar.");
  }

  return new NextResponse(new Uint8Array(avatar.data), {
    status: 200,
    headers: {
      "Content-Type": avatar.mimeType,
      "Content-Length": String(avatar.data.length),
      "Cache-Control": "public, max-age=3600",
      ETag: `"${avatar.updatedAt.getTime()}"`,
    },
  });
});
