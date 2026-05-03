// Product detail API route supporting update and delete operations.
import { NextResponse } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api";
import { productRepository } from "@/lib/repositories/mock";
import { productSchema } from "@/schemas/product.schema";
import type { Product } from "@/types/product";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = (await request.json()) as unknown;
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(createErrorResponse<Product>("Invalid product payload."), {
      status: 400,
    });
  }

  const updated = await productRepository.updateProduct(id, { id, ...parsed.data });
  if (!updated) {
    return NextResponse.json(createErrorResponse<Product>("Product not found."), { status: 404 });
  }

  return NextResponse.json(createSuccessResponse(updated, "Product updated."));
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const deleted = await productRepository.deleteProduct(id);
  if (!deleted) {
    return NextResponse.json(createErrorResponse("Product not found."), { status: 404 });
  }

  return NextResponse.json(createSuccessResponse({ deleted: true }, "Product deleted."));
}
