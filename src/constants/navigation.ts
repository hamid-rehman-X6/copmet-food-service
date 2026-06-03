import type { FooterColumn, NavItem } from "@/types/common.types";

export const brandName = "Copmet Food Service";

export const brandAssets = {
  logo: {
    src: "/images/logos/cfs-logo.png",
    alt: "Copmet Food Service logo",
  },
  favicon: "/images/logos/favicon.png",
};

export const mainNavigation: NavItem[] = [
  { label: "Menu", href: "/our-menu" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "About", href: "/#community" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/#community" },
      { label: "Careers", href: "/" },
      { label: "Sustainability", href: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/track-your-feast" },
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Our Menu", href: "/our-menu" },
      { label: "Secure Checkout", href: "/secure-checkout" },
      { label: "Track Your Feast", href: "/track-your-feast" },
    ],
  },
];
