import { errors } from "@/server/api/errors";
import { buildPageMeta, type Pagination } from "@/server/api/pagination";
import {
  countCustomers,
  findCustomerById,
  listCustomers,
  type CustomerListFilters,
} from "@/server/customers/customers.repository";
import { listOrders } from "@/server/orders/orders.repository";
import type { Paginated } from "@/types/common.types";
import type { AdminCustomerDetail, AdminCustomerSummary } from "@/types/customer.types";

type ListOptions = { filters: CustomerListFilters; pagination: Pagination };

/** Admin customer listing with filters + pagination. */
export async function listCustomersService(options: ListOptions): Promise<Paginated<AdminCustomerSummary>> {
  const [items, totalItems] = await Promise.all([
    listCustomers(options.filters, options.pagination.limit, options.pagination.offset),
    countCustomers(options.filters),
  ]);

  return { items, meta: buildPageMeta(options.pagination, totalItems) };
}

/** Customer detail including their most recent orders. */
export async function getCustomerDetailService(id: string): Promise<AdminCustomerDetail> {
  const customer = await findCustomerById(id);

  if (!customer) {
    throw errors.notFound("Customer not found.");
  }

  const recentOrders = await listOrders({ userId: id }, 10, 0);
  return { ...customer, recentOrders };
}
