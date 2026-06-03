import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nourish & Gather",
  description: "Handcrafted meals for shared moments, delivered with heart.",
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
