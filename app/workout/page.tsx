import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Calendar, Dumbbell } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function WorkoutPage() {
  const session = await getServerSession(authOptions); if (!session?.user) redirect("/login");
  const [upcoming, history] = await Promise.all([
    prisma.workoutAssignment.findMany({ where: { userId: session.user.id, isCompleted: false }, include: { workoutPlan: { include: { workoutPlanExercises: true } } }, orderBy: { dueDate: "asc" }, take: 6 }),
    prisma.workoutLog.findMany({ where: { userId: session.user.id, isCompleted: true }, include: { workoutSets: true }, orderBy: { date: "desc" }, take: 5 }),
  ]);
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 page-enter"><div><p className="eyebrow">Training plan</p><h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Workouts</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Show up, follow the plan, and let consistency do the work.</p></div><div className="grid gap-6 lg:grid-cols-2"><Card className="motion-card"><CardHeader><CardTitle>Upcoming sessions</CardTitle></CardHeader><CardContent className="space-y-3">{upcoming.length ? upcoming.map((item) => <div key={item.id} className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900 dark:text-white">{item.workoutPlan.name}</p><p className="mt-1 text-sm text-slate-500">{item.workoutPlan.workoutPlanExercises.length} exercises · {item.workoutPlan.durationMin} min</p></div><Badge variant="outline">{item.workoutPlan.difficulty.toLowerCase()}</Badge></div><p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /> Due {item.dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p></div>) : <Empty text="No upcoming workouts yet. Your trainer can add one when your plan is ready." />}</CardContent></Card><Card className="motion-card" style={{ animationDelay: "100ms" }}><CardHeader><CardTitle>Recent history</CardTitle></CardHeader><CardContent className="space-y-3">{history.length ? history.map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 dark:border-slate-800"><div><p className="font-semibold text-slate-900 dark:text-white">{item.name}</p><p className="mt-1 text-sm text-slate-500">{item.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p></div><Badge variant="secondary">{item.workoutSets.length} sets</Badge></div>) : <Empty text="Your completed workouts will appear here." />}</CardContent></Card></div></div>;
}
function Empty({ text }: { text: string }) { return <div className="py-10 text-center text-slate-500"><Dumbbell className="mx-auto mb-3 h-8 w-8 text-slate-400" />{text}</div>; }
