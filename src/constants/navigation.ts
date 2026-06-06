import type { FooterColumn, NavItem } from "@/types/common.types";

export const brandName = "Copmet Food Service";

export const brandAssets = {
  logo: {
    src: "/images/logos/cfs-logo.png",
    alt: "Copmet Food Service logo",
  },
};

export const mainNavigation: NavItem[] = [
  { label: "Frozen Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      {
        label: "Careers",
        href: "/careers",
        comingSoon: {
          title: "Careers are coming soon",
          message: "We are still preparing our hiring page. Check back soon for roles with Copmet Food Service.",
        },
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        label: "Track Order",
        href: "/track-order",
        comingSoon: {
          title: "Order tracking is coming soon",
          message: "Live frozen-order tracking is almost ready. For now, our team will share delivery updates after checkout.",
        },
      },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Frozen Catalog", href: "/menu" },
      { label: "Checkout", href: "/checkout" },
      {
        label: "Track Order",
        href: "/track-order",
        comingSoon: {
          title: "Order tracking is coming soon",
          message: "Live frozen-order tracking is almost ready. For now, our team will share delivery updates after checkout.",
        },
      },
    ],
  },
];
