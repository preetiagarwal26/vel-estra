import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vel-Estra | Property Intelligence",
  description:
    "Explainable buy / pass / negotiate decisions for residential real-estate investors.",
  icons: {
    icon: "/vel-estra-logo.jpg",
    apple: "/vel-estra-logo.jpg",
  },
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
