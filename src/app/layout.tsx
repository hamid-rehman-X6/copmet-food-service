import type { Metadata } from "next";
import { brandAssets, brandName } from "@/constants/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: brandName,
  description: "Handcrafted meals from Copmet Food Service, delivered with heart.",
  icons: {
    icon: brandAssets.favicon,
    shortcut: brandAssets.favicon,
    apple: brandAssets.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
