import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CalendarDays, Dumbbell, Droplets, Utensils } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function todayRange() { const start = new Date(); start.setHours(0, 0, 0, 0); const end = new Date(start); end.setDate(end.getDate() + 1); return { start, end }; }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { start, end } = todayRange();
  const [workouts, foods, water, nextWorkout] = await Promise.all([
    prisma.workoutLog.count({ where: { userId: session.user.id, date: { gte: start, lt: end }, isCompleted: true } }),
    prisma.foodLog.findMany({ where: { userId: session.user.id, date: { gte: start, lt: end } }, include: { food: true } }),
    prisma.waterLog.aggregate({ where: { userId: session.user.id, date: { gte: start, lt: end } }, _sum: { amountMl: true } }),
    prisma.workoutAssignment.findFirst({ where: { userId: session.user.id, isCompleted: false, dueDate: { gte: start } }, include: { workoutPlan: true }, orderBy: { dueDate: "asc" } }),
  ]);
  const calories = foods.reduce((sum, entry) => sum + entry.food.calories * entry.quantity, 0);
  const cards = [{ label: "Workouts", value: String(workouts), detail: "completed today", icon: Dumbbell, href: "/workout" }, { label: "Calories", value: String(Math.round(calories)), detail: "logged today", icon: Utensils, href: "/nutrition" }, { label: "Hydration", value: `${((water._sum.amountMl ?? 0) / 1000).toFixed(1)} L`, detail: "logged today", icon: Droplets, href: "/nutrition" }];
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 page-enter"><div><p className="eyebrow">Today’s focus</p><h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}.</h1><p className="mt-2 text-slate-600 dark:text-slate-400">A little progress is still progress. Here’s your daily snapshot.</p></div><div className="grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, detail, icon: Icon, href }, index) => <Link href={href} key={label} className="motion-card" style={{ animationDelay: `${index * 80}ms` }}><Card><CardContent className="pt-6"><div className="flex justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className="h-5 w-5 text-primary" /></div><p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p><p className="mt-1 text-sm text-slate-500">{detail}</p></CardContent></Card></Link>)}</div><Card className="motion-card" style={{ animationDelay: "240ms" }}><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Your next workout</CardTitle></CardHeader><CardContent>{nextWorkout ? <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900 dark:text-white">{nextWorkout.workoutPlan.name}</p><p className="mt-1 text-sm text-slate-500">Due {nextWorkout.dueDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</p></div><Button asChild><Link href="/workout">View workout</Link></Button></div> : <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-slate-600 dark:text-slate-400">No workout is scheduled yet. Use today to set a simple, sustainable goal.</p><Button variant="outline" asChild><Link href="/workout">Explore workouts</Link></Button></div>}</CardContent></Card></div>;
}
