import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virology Quiz",
  description: "100 Critical Thinking Case-Based Virology Questions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
