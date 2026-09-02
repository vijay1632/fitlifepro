import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
            FitLife Pro
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The complete fitness management and personal tracking platform
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/register"
            className="px-8 py-4 bg-transparent border-2 border-slate-700 text-slate-300 rounded-lg text-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Create Account
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-white mb-2">Track Workouts</h3>
              <p className="text-slate-400">
                Log exercises, sets, and reps with ease
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-white mb-2">Monitor Nutrition</h3>
              <p className="text-slate-400">
                Track meals, calories, and macros
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-white mb-2">Visual Progress</h3>
              <p className="text-slate-400">
                Monitor weight and body measurements
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}