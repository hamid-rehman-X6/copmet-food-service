// Admin stats API route guarded by authenticated session.
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { categoryRepository, orderRepository, productRepository } from "@/lib/repositories/mock";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(createErrorResponse("Unauthorized."), { status: 401 });
  }

  const [products, categories, orders] = await Promise.all([
    productRepository.getProducts(),
    categoryRepository.getCategories(),
    orderRepository.getOrders(),
  ]);

  return NextResponse.json(
    createSuccessResponse({
      totalProducts: products.length,
      totalCategories: categories.length,
      recentOrders: orders.length,
    }),
  );
}
