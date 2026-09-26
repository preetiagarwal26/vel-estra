import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vel-Estra | Property Intelligence",
  description:
    "Explainable buy / pass / negotiate decisions for residential real-estate investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
