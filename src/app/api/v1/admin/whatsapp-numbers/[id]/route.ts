import type { NextRequest } from "next/server";
import { updateWhatsappNumberSchema } from "@/schemas/admin.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { deleteWhatsappNumberService, updateWhatsappNumberService } from "@/server/admin/whatsapp.service";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/v1/admin/whatsapp-numbers/:id — edit label/phone/active (admin only).
export const PATCH = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  const input = await parseJson(request, updateWhatsappNumberSchema);
  const number = await updateWhatsappNumberService(id, input);

  return success({ number }, "WhatsApp number updated.");
});

// DELETE /api/v1/admin/whatsapp-numbers/:id — remove a number (admin only).
export const DELETE = withApiHandler(async (request: NextRequest, context: RouteContext) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const { id } = await context.params;
  await deleteWhatsappNumberService(id);

  return success({ id }, "WhatsApp number removed.");
});
