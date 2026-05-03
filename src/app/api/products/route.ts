// Product API route with Zod validation and contract responses.
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api";
import { productRepository } from "@/lib/repositories/mock";
import { productSchema } from "@/schemas/product.schema";
import type { Product } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const products = await productRepository.getProducts(search);
  return NextResponse.json(createSuccessResponse(products));
}

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      createErrorResponse<Product>("Invalid product payload.", [
        {
          field: parsed.error.issues[0]?.path.join(".") ?? "payload",
          message: parsed.error.issues[0]?.message ?? "Validation failed.",
        },
      ]),
      { status: 400 },
    );
  }

  const created = await productRepository.createProduct({
    id: randomUUID(),
    ...parsed.data,
  });
  return NextResponse.json(createSuccessResponse(created, "Product created."), { status: 201 });
}
