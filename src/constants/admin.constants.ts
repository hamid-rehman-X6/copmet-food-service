import type { AdminCustomer, AdminDish, AdminMetric, AdminNavItem, AdminOrder } from "@/types/admin.types";

export const adminNavigation: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Frozen Catalog", href: "/admin/menu", icon: "utensils" },
  { label: "Customers", href: "/admin/customers", icon: "users" },
  { label: "Orders", href: "/admin/orders", icon: "receipt" },
];

export const dashboardMetrics: AdminMetric[] = [
  { label: "Revenue", value: "$18,420", change: "+12.8%", detail: "vs. last month", icon: "wallet", tone: "primary" },
  { label: "Orders", value: "286", change: "+8.4%", detail: "vs. last month", icon: "receipt", tone: "warning" },
  { label: "Customers", value: "1,248", change: "+6.1%", detail: "active accounts", icon: "users", tone: "success" },
  { label: "Freezer Items", value: "48", change: "42 active", detail: "across 5 categories", icon: "utensils", tone: "neutral" },
];

export const menuMetrics: AdminMetric[] = [
  { label: "Total Items", value: "48", detail: "Across frozen categories", icon: "utensils", tone: "primary" },
  { label: "Ready Stock", value: "42", detail: "Available for delivery", icon: "check", tone: "success" },
  { label: "Low Stock", value: "4", detail: "Needs batch prep", icon: "minus", tone: "danger" },
  { label: "Batch Drafts", value: "2", detail: "Awaiting review", icon: "book", tone: "warning" },
];

export const customerMetrics: AdminMetric[] = [
  { label: "Total Customers", value: "1,248", change: "+6.1%", detail: "vs. last month", icon: "users", tone: "primary" },
  { label: "Active This Month", value: "864", detail: "69% of customers", icon: "check", tone: "success" },
  { label: "New Customers", value: "96", change: "+14.2%", detail: "this month", icon: "plus", tone: "warning" },
  { label: "Average Spend", value: "$64.20", detail: "per customer", icon: "wallet", tone: "neutral" },
];

export const orderMetrics: AdminMetric[] = [
  { label: "Total Orders", value: "286", change: "+8.4%", detail: "this month", icon: "receipt", tone: "primary" },
  { label: "Packing Frozen", value: "18", detail: "Cold packed in kitchen", icon: "utensils", tone: "warning" },
  { label: "Cold Delivery", value: "12", detail: "Out for delivery", icon: "truck", tone: "success" },
  { label: "Cancelled", value: "4", detail: "1.4% cancellation rate", icon: "x", tone: "danger" },
];

export const adminDishes: AdminDish[] = [
  {
    id: "dish-01",
    name: "Mediterranean Family Grain Tray",
    detail: "Vegan, Nut-Free, Freezer Tray",
    category: "Family Packs",
    price: 15.5,
    status: "Active",
    image: { src: "/images/menu/harvest-bowl-img.png", alt: "Mediterranean grain tray." },
  },
  {
    id: "dish-02",
    name: "Rustic Slow-Roasted Beef Tray",
    detail: "Family Pack",
    category: "Family Packs",
    price: 24,
    status: "Active",
    image: { src: "/images/home-page/beaf-steak-img.png", alt: "Slow-roasted beef tray." },
  },
  {
    id: "dish-03",
    name: "Frozen Dark Chocolate Torte",
    detail: "Gluten-Free, Short Thaw",
    category: "Desserts",
    price: 10,
    status: "Inactive",
    image: { src: "/images/home-page/choco-strawberry-cake.png", alt: "Frozen dark chocolate torte." },
  },
  {
    id: "dish-04",
    name: "Lemon Salmon Meal Pack",
    detail: "Organic, Gluten-Free",
    category: "Mains",
    price: 18,
    status: "Out of Stock",
    image: { src: "/images/menu/wild-salmon-img.png", alt: "Lemon salmon meal pack." },
  },
  {
    id: "dish-05",
    name: "Mint Lemonade Concentrate",
    detail: "Organic, Nut-Free",
    category: "Sides",
    price: 6.5,
    status: "Draft",
    image: { src: "/images/menu/mint-sparkler-img.png", alt: "Mint lemonade concentrate." },
  },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "CUS-1048", name: "Sophia Carter", email: "sophia@example.com", orders: 18, totalSpent: 1248.5, joined: "May 18, 2026", status: "Active" },
  { id: "CUS-1047", name: "James Wilson", email: "james@example.com", orders: 12, totalSpent: 842, joined: "May 14, 2026", status: "Active" },
  { id: "CUS-1046", name: "Olivia Martin", email: "olivia@example.com", orders: 9, totalSpent: 618.25, joined: "May 10, 2026", status: "Active" },
  { id: "CUS-1045", name: "Ethan Brooks", email: "ethan@example.com", orders: 4, totalSpent: 216, joined: "April 28, 2026", status: "Inactive" },
  { id: "CUS-1044", name: "Ava Thompson", email: "ava@example.com", orders: 15, totalSpent: 1034.75, joined: "April 21, 2026", status: "Active" },
];

export const adminOrders: AdminOrder[] = [
  { id: "ORD-82910", customer: "Sophia Carter", items: 3, total: 52.5, placed: "Today, 10:24 AM", status: "Packing Frozen" },
  { id: "ORD-82909", customer: "James Wilson", items: 2, total: 38, placed: "Today, 9:48 AM", status: "Cold Delivery" },
  { id: "ORD-82908", customer: "Olivia Martin", items: 5, total: 84.25, placed: "Today, 9:12 AM", status: "Delivered" },
  { id: "ORD-82907", customer: "Ethan Brooks", items: 1, total: 18, placed: "Yesterday, 8:44 PM", status: "Cancelled" },
  { id: "ORD-82906", customer: "Ava Thompson", items: 4, total: 67.5, placed: "Yesterday, 7:30 PM", status: "Delivered" },
];
