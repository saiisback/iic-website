import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IIC — BMSIT Innovation Passport",
  description: "The digital innovation passport for IIC BMSIT members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
