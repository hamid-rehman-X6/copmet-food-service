// Order API route for WhatsApp order log records.
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createErrorResponse, createSuccessResponse } from "@/lib/api";
import { orderRepository } from "@/lib/repositories/mock";
import type { OrderLog } from "@/types/order";

const orderSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  quantity: z.number().min(1),
  variant: z.string().min(1),
});

export async function GET() {
  const orders = await orderRepository.getOrders();
  return NextResponse.json(createSuccessResponse(orders));
}

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      createErrorResponse<OrderLog>("Invalid order payload.", [
        {
          field: parsed.error.issues[0]?.path.join(".") ?? "payload",
          message: parsed.error.issues[0]?.message ?? "Validation failed.",
        },
      ]),
      { status: 400 },
    );
  }

  const order = await orderRepository.createOrder({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed.data,
  });
  return NextResponse.json(createSuccessResponse(order, "Order logged."), { status: 201 });
}
