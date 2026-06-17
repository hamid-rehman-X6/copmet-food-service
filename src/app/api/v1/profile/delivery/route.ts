import type { NextRequest } from "next/server";
import { deliveryDefaultsSchema } from "@/schemas/profile.schemas";
import { withApiHandler } from "@/server/api/handler";
import { assertTrustedOrigin, parseJson } from "@/server/api/request";
import { success } from "@/server/api/response";
import { requireAccessToken } from "@/server/auth/authenticate";
import { getDeliveryDefaultsService, saveDeliveryDefaults } from "@/server/profile/profile.service";

// GET /api/v1/profile/delivery — the customer's saved default delivery details.
export const GET = withApiHandler(async (request: NextRequest) => {
  const session = await requireAccessToken(request);
  const delivery = await getDeliveryDefaultsService(session.userId);

  return success({ delivery }, "Delivery details retrieved.");
});

// PUT /api/v1/profile/delivery — save (or clear) the default delivery details.
export const PUT = withApiHandler(async (request: NextRequest) => {
  assertTrustedOrigin(request);
  const session = await requireAccessToken(request);
  const input = await parseJson(request, deliveryDefaultsSchema);
  const delivery = await saveDeliveryDefaults(session.userId, input);

  return success({ delivery }, "Your delivery details have been saved.");
});
