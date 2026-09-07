import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Activity, ArrowRight, BarChart3, Dumbbell, HeartPulse } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Dumbbell, title: "Train with purpose", description: "Follow workouts, log sessions, and keep your routine moving." },
  { icon: HeartPulse, title: "Fuel your progress", description: "Make nutrition and hydration part of your daily rhythm." },
  { icon: BarChart3, title: "See your momentum", description: "Turn regular check-ins into a clear view of your progress." },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return <main className="landing-shell"><div className="landing-orb landing-orb-one" /><div className="landing-orb landing-orb-two" /><section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 py-16 sm:px-8"><div className="max-w-3xl page-enter"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-sm font-medium text-sky-100"><Activity className="h-4 w-4" /> A healthier routine, built around you</div><h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl">Fitness that feels <span className="text-sky-300">possible</span> every day.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">FitLife Pro gives you one focused place to train, nourish, and track the progress that matters to you.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="/register" className="motion-button inline-flex items-center justify-center rounded-lg bg-sky-400 px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-sky-400/20 hover:bg-sky-300">Create your account <ArrowRight className="ml-2 h-4 w-4" /></a><a href="/login" className="motion-button inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3.5 font-semibold text-white hover:border-slate-400 hover:bg-white/5">Sign in</a></div></div><div className="mt-16 grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, description }, index) => <Card key={title} className="motion-card border-white/10 bg-slate-900/55 text-white backdrop-blur" style={{ animationDelay: `${180 + index * 90}ms` }}><CardContent className="pt-6"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/15 text-sky-300"><Icon className="h-5 w-5" /></span><h2 className="mt-5 text-lg font-semibold">{title}</h2><p className="mt-2 leading-6 text-slate-300">{description}</p></CardContent></Card>)}</div></section></main>;
}
