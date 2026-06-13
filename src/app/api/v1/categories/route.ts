import { withApiHandler } from "@/server/api/handler";
import { success } from "@/server/api/response";
import { listCategoriesService } from "@/server/catalog/catalog.service";

// GET /api/v1/categories
// Public list of catalog categories, used for storefront filters and the
// admin product form's category picker.
export const GET = withApiHandler(async () => {
  const categories = await listCategoriesService();
  return success({ categories }, "Categories retrieved.");
});
