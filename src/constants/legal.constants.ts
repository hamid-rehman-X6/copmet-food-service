import type { IconName } from "@/components/common/Icon";

export type LegalSummary = {
  title: string;
  description: string;
  icon: IconName;
};

export type LegalSection = {
  title: string;
  body: string[];
};

export const legalLastUpdated = "June 5, 2026";

export const termsSummaries: LegalSummary[] = [
  {
    title: "Clear ordering",
    description: "Orders should be accurate, paid for, and placed with current frozen-meal delivery details.",
    icon: "receipt",
  },
  {
    title: "Reliable cold handling",
    description: "We prepare, pack, and deliver frozen meals with care while keeping customers informed.",
    icon: "truck",
  },
  {
    title: "Respectful use",
    description: "Accounts and services must be used lawfully and without disrupting others.",
    icon: "shield",
  },
];

export const privacySummaries: LegalSummary[] = [
  {
    title: "Account details",
    description: "We use account and contact information to support ordering and delivery.",
    icon: "user",
  },
  {
    title: "Secure handling",
    description: "We protect personal information with careful access and security practices.",
    icon: "lock",
  },
  {
    title: "Useful updates",
    description: "We may send service messages related to orders, accounts, and support.",
    icon: "bell",
  },
];

export const termsSections: LegalSection[] = [
  {
    title: "Using Copmet Food Service",
    body: [
      "By using our website, creating an account, or placing an order, you agree to use Copmet Food Service for lawful personal or business frozen meal ordering purposes.",
      "You are responsible for keeping your account details accurate, including your name, delivery address, phone number, payment information, and any delivery notes needed for frozen meal drop-off.",
    ],
  },
  {
    title: "Orders and payments",
    body: [
      "Prices, freezer-stock availability, delivery windows, and promotions may change based on kitchen capacity, ingredient availability, batch schedules, and service area.",
      "An order is confirmed when the checkout flow is completed and accepted by the service. If an issue prevents fulfillment, we may contact you to adjust, replace, or cancel the order.",
    ],
  },
  {
    title: "Frozen delivery and customer care",
    body: [
      "We do our best to meet estimated delivery times, but weather, traffic, address issues, cold-packing requirements, and operational delays may affect arrival.",
      "Please move frozen items to your freezer promptly after delivery and follow the warming instructions included with each product.",
      "Please contact support promptly if an order arrives incomplete, damaged, thawed beyond normal delivery handling, or meaningfully different from what you selected.",
    ],
  },
  {
    title: "Account safety",
    body: [
      "Keep your password private and notify us if you believe your account has been accessed without permission.",
      "We may restrict or close accounts that misuse the service, provide false information, attempt fraud, or interfere with the platform.",
    ],
  },
  {
    title: "Updates to these terms",
    body: [
      "We may update these terms as the service grows. The latest version will be posted on this page with the updated date.",
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    title: "Information we collect",
    body: [
      "We collect information you provide when you create an account, place an order, contact support, or subscribe to updates. This may include your name, email, phone number, delivery address, freezer meal preferences, and order history.",
      "We may also collect basic technical information, such as browser type, device data, and usage activity, to keep the service reliable and secure.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use personal information to create accounts, process orders, coordinate frozen meal delivery, provide support, prevent misuse, and improve the customer experience.",
      "We may send transactional messages about orders, account security, delivery updates, or important service changes.",
    ],
  },
  {
    title: "Sharing and service partners",
    body: [
      "We only share information when needed to operate the service, such as with delivery, payment, hosting, analytics, or support providers.",
      "We do not sell personal information. Service partners are expected to handle information only for the work they perform for Copmet Food Service.",
    ],
  },
  {
    title: "Data protection",
    body: [
      "We use reasonable administrative and technical safeguards to protect customer information from unauthorized access, loss, or misuse.",
      "No online service can guarantee perfect security, so customers should use strong passwords and keep account access private.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may update your account details, request support, or ask questions about how your information is used by contacting Copmet Food Service.",
      "We may retain some information when needed for order records, security, legal compliance, and business operations.",
    ],
  },
];
