import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { AppNavigation } from "@/components/layout/AppNavigation";

export const metadata: Metadata = {
  title: "FitLife Pro - Modern Fitness Platform",
  description: "Complete fitness management and personal tracking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppNavigation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
