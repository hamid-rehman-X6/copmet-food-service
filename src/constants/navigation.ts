import type { FooterColumn, NavItem } from "@/types/common.types";

export const brandName = "Copmet Food Service";

export const brandAssets = {
  logo: {
    src: "/images/logos/cfs-logo.png",
    alt: "Copmet Food Service logo",
  },
};

export const mainNavigation: NavItem[] = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/" },
      { label: "Sustainability", href: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "Checkout", href: "/checkout" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
];
