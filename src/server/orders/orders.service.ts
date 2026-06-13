import { randomBytes } from "node:crypto";
import { errors } from "@/server/api/errors";
import { buildPageMeta, type Pagination } from "@/server/api/pagination";
import { findProductsForOrder } from "@/server/catalog/catalog.repository";
import { transaction } from "@/server/db/pool";
import {
  countOrders,
  findOrderDetail,
  insertOrder,
  listOrders,
  updateOrderStatus,
  type NewOrderItem,
  type OrderListFilters,
} from "@/server/orders/orders.repository";
import { getSettings } from "@/server/settings/settings.service";
import type { PlaceOrderInput } from "@/schemas/order.schemas";
import type { Paginated } from "@/types/common.types";
import type { OrderDetail, OrderStatus, OrderSummary } from "@/types/order.types";

// Round to 2 decimal places to avoid floating-point drift in money math.
function round2(value: number) {
  return Math.round(value * 100) / 100;
}

// Short, human-friendly order reference, e.g. ORD-9F2A7C3B.
function generateReference() {
  return `ORD-${randomBytes(4).toString("hex").toUpperCase()}`;
}

/**
 * Place an order for a customer. The client sends only product ids + quantities;
 * prices, totals, delivery fee, and currency are all computed server-side from
 * the database and store settings so they cannot be tampered with.
 */
export async function placeOrder(input: PlaceOrderInput, userId: string): Promise<OrderDetail> {
  // Merge duplicate product lines into a single quantity.
  const quantities = new Map<string, number>();
  for (const item of input.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const products = await findProductsForOrder([...quantities.keys()]);
  const productsById = new Map(products.map((product) => [product.id, product]));

  const lineItems: NewOrderItem[] = [];
  for (const [productId, quantity] of quantities) {
    const product = productsById.get(productId);

    if (!product || product.status !== "ACTIVE") {
      throw errors.badRequest("One or more items are no longer available.");
    }

    lineItems.push({
      productId,
      productName: product.name,
      productImageUrl: product.imageUrl,
      unitPrice: product.price,
      quantity,
      lineTotal: round2(product.price * quantity),
    });
  }

  const settings = await getSettings();
  const subtotal = round2(lineItems.reduce((sum, item) => sum + item.lineTotal, 0));
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = round2(subtotal + deliveryFee);

  const orderId = await transaction((client) =>
    insertOrder(
      client,
      {
        reference: generateReference(),
        userId,
        subtotal,
        deliveryFee,
        total,
        currencyCode: settings.currencyCode,
        contactFirstName: input.contact.firstName,
        contactLastName: input.contact.lastName,
        contactPhone: input.contact.phone ?? null,
        deliveryAddress: input.delivery.address,
        deliveryCity: input.delivery.city,
        deliveryPostalCode: input.delivery.postalCode ?? null,
        deliveryInstructions: input.delivery.instructions ?? null,
      },
      lineItems,
    ),
  );

  const detail = await findOrderDetail(orderId);
  if (!detail) {
    throw errors.notFound("Order could not be loaded after creation.");
  }

  return detail;
}

type ListOptions = { filters: OrderListFilters; pagination: Pagination };

/** Admin order listing with filters + pagination. */
export async function listOrdersService(options: ListOptions): Promise<Paginated<OrderSummary>> {
  const [items, totalItems] = await Promise.all([
    listOrders(options.filters, options.pagination.limit, options.pagination.offset),
    countOrders(options.filters),
  ]);

  return { items, meta: buildPageMeta(options.pagination, totalItems) };
}

export async function getOrderDetailService(id: string, userId?: string): Promise<OrderDetail> {
  const order = await findOrderDetail(id, userId);

  if (!order) {
    throw errors.notFound("Order not found.");
  }

  return order;
}

export async function updateOrderStatusService(id: string, status: OrderStatus): Promise<OrderDetail> {
  const updated = await updateOrderStatus(id, status);

  if (!updated) {
    throw errors.notFound("Order not found.");
  }

  return getOrderDetailService(id);
}
