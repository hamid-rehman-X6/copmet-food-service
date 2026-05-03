// Centralized route constants to avoid magic route strings.
export const ROUTES = {
  home: "/",
  products: "/products",
  categories: "/categories",
  adminLogin: "/admin/login",
  adminDashboard: "/admin/dashboard",
  adminProducts: "/admin/products",
  adminNewProduct: "/admin/products/new",
  adminCategories: "/admin/categories",
  adminOrders: "/admin/orders",
} as const;
