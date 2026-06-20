import type { NextRequest } from "next/server";
import { createWhatsappNumberSchema } from "@/schemas/admin.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireRole } from "@/server/auth/authenticate";
import { createWhatsappNumberService, listWhatsappNumbersService } from "@/server/admin/whatsapp.service";

// GET /api/v1/admin/whatsapp-numbers — list all numbers (admin only).
export const GET = withApiHandler(async (request: NextRequest) => {
  await requireRole(request, ["ADMIN"]);
  const numbers = await listWhatsappNumbersService();

  return success({ numbers }, "WhatsApp numbers retrieved.");
});

// POST /api/v1/admin/whatsapp-numbers — add a number (admin only).
export const POST = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  await requireRole(request, ["ADMIN"]);
  const input = await parseJson(request, createWhatsappNumberSchema);
  const number = await createWhatsappNumberService(input);

  return success({ number }, "WhatsApp number added.", 201);
});
