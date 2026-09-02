import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { Settings } from "@/components/layout/Settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitLife Pro - Modern Fitness Platform",
  description: "Complete fitness management and personal tracking platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
        <Settings />
      </body>
    </html>
  );
}