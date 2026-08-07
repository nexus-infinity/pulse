import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PULSE — Sovereign Home OS",
  description: "Browser dashboard for PULSE at 10 Watts Parade. Zone map, device registry, action console.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
