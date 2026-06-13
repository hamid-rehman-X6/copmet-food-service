export type NavItem = {
  label: string;
  href: string;
  comingSoon?: {
    title: string;
    message: string;
  };
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

// Standard envelope for paginated list endpoints. Keeps the response lean while
// giving the client everything it needs to render pagination controls.
export type PageMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PageMeta;
};
