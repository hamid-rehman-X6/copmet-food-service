import type { Metadata } from "next";
import { brandName } from "@/constants/navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { getSettings } from "@/server/settings/settings.service";
import type { PublicSettings } from "@/types/settings.types";
import "./globals.css";

export const metadata: Metadata = {
  title: brandName,
  description: "Homemade frozen meals from Copmet Food Service, delivered ready for your freezer.",
};

// Sensible defaults used before migrations run or if settings are unavailable,
// so the UI never crashes on a missing settings row.
const fallbackSettings: PublicSettings = {
  currencyCode: "PKR",
  currencyLocale: "en-PK",
  deliveryFee: 250,
  freeDeliveryThreshold: 5000,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings().catch(() => fallbackSettings);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <CurrencyProvider settings={settings}>
          <AuthProvider>{children}</AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
