export type NavItem = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: NavItem[];
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type BadgeTone = "primary" | "secondary" | "tertiary" | "neutral";
