import type { SVGProps } from "react";

type IconName =
  | "arrowLeft"
  | "arrowRight"
  | "book"
  | "card"
  | "cart"
  | "check"
  | "chef"
  | "chevronDown"
  | "gift"
  | "heart"
  | "home"
  | "location"
  | "lock"
  | "mail"
  | "message"
  | "minus"
  | "phone"
  | "plus"
  | "search"
  | "shield"
  | "star"
  | "truck"
  | "user"
  | "utensils"
  | "wallet";

const paths: Record<IconName, string> = {
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5ZM4 5.5v16",
  card: "M3 6h18v12H3zM3 10h18M16 15h3",
  cart: "M3 4h2l2.2 10.5a2 2 0 0 0 2 1.5h7.7a2 2 0 0 0 1.9-1.4L21 8H6M10 20h.01M18 20h.01",
  check: "M5 12l4 4L19 6",
  chef: "M7 11h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-8ZM7 11a4 4 0 1 1 3.5-5.9A4 4 0 0 1 18 7a3.5 3.5 0 0 1-1 6",
  chevronDown: "M6 9l6 6 6-6",
  gift: "M4 12h16v9H4zM3 8h18v4H3zM12 8v13M12 8c-2.8 0-5-1-5-3a2 2 0 0 1 3.4-1.4C11.4 4.6 12 8 12 8Zm0 0s.6-3.4 2.6-4.4A2 2 0 0 1 17 5c0 2-2.2 3-5 3Z",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z",
  home: "M4 11 12 4l8 7v9h-5v-6H9v6H4z",
  location: "M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  lock: "M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3M12 14v3",
  mail: "M3 5h18v14H3zM3 7l9 7 9-7",
  message: "M4 5h16v11H8l-4 4V5Z",
  minus: "M5 12h14",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.7.7 2.5a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.6-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.6 2.5.7a2 2 0 0 1 1.7 2Z",
  plus: "M12 5v14M5 12h14",
  search: "M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8ZM16 16l5 5",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5",
  star: "m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5-4.7-4.6 6.5-.9L12 3Z",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  utensils: "M7 3v8M4 3v8M10 3v8M4 11h6M7 11v10M17 3v18M14 3c0 5 1.5 8 3 8s3-3 3-8",
  wallet: "M3 7h18v14H3zM17 12h4v4h-4a2 2 0 0 1 0-4ZM5 7V5h14v2",
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
