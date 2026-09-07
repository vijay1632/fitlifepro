"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Dumbbell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  ["Dashboard", "/dashboard"],
  ["Workouts", "/workout"],
  ["Nutrition", "/nutrition"],
  ["Progress", "/progress"],
  ["Membership", "/membership"],
] as const;

export function AppNavigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  if (status !== "authenticated" || !session?.user) return null;

  return <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85"><div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3"><Link href="/dashboard" className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Dumbbell className="h-4 w-4" /></span><span className="hidden sm:inline">FitLife Pro</span></Link><nav aria-label="Main navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"><div className="flex gap-1">{links.map(([label, href]) => <Link key={href} href={href} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === href ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white")}>{label}</Link>)}</div></nav><Button aria-label="Sign out" variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })}><LogOut className="h-4 w-4" /></Button></div></header>;
}
