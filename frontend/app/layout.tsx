import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import { fontVariableStyle } from "@/lib/fonts";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garmin Tracker UI",
  description: "Fast, responsive interface for Garmin activity insights.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={fontVariableStyle}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
