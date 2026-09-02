import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Dumbbell, Droplets, Flame, Weight, Zap } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import { UserRole } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  const userId = session.user.id;

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get user's last workout
  const lastWorkout = await prisma.workoutLog.findFirst({
    where: {
      userId,
      isCompleted: true,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      workoutSets: {
        include: {
          exercise: true,
        },
      },
    },
  });

  // Get today's stats
  const todayWorkouts = await prisma.workoutLog.count({
    where: {
      userId,
      date: today,
      isCompleted: true,
    },
  });

  const todayFoodLogs = await prisma.foodLog.findMany({
    where: {
      userId,
      date: today,
    },
    include: {
      food: true,
    },
  });

  const todayWaterLogs = await prisma.waterLog.findMany({
    where: {
      userId,
      date: today,
    },
  });

  const totalCalories = todayFoodLogs.reduce(
    (sum, log) => sum + log.food.calories * log.quantity,
    0
  );
  const totalProtein = todayFoodLogs.reduce((sum, log) => sum + log.food.protein * log.quantity, 0);
  const totalCarbs = todayFoodLogs.reduce((sum, log) => sum + log.food.carbs * log.quantity, 0);
  const totalFat = todayFoodLogs.reduce((sum, log) => sum + log.food.fat * log.quantity, 0);

  const totalWater = todayWaterLogs.reduce((sum, log) => sum + log.amountMl, 0);

  // Get upcoming workout
  const upcomingWorkout = await prisma.workoutAssignment.findFirst({
    where: {
      userId,
      dueDate: {
        gte: today,
      },
      isCompleted: false,
    },
    include: {
      workoutPlan: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  // Get user's trainer
  const member = await prisma.member.findUnique({
    where: { userId },
    include: {
      trainer: true,
      profile: true,
    },
  });

  // Get recent activity
  const recentActivity = await prisma.workoutLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
    take: 3,
    include: {
      workoutSets: {
        include: {
          exercise: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {member?.profile?.firstName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {member?.trainer ? `Your trainer: ${member.trainer.user.profile?.firstName}` : "Your personal fitness journey"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Calories</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalCalories.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">kcal consumed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Protein</CardTitle>
              <Dumbbell className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalProtein.toFixed(0)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">g consumed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Workouts</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {todayWorkouts}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Water</CardTitle>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {(totalWater / 1000).toFixed(1)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">liters</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Workout */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Workout</CardTitle>
                  <Link href="/workout">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingWorkout ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {upcomingWorkout.workoutPlan.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {upcomingWorkout.workoutPlan.exercises.length} exercises
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDate(upcomingWorkout.dueDate)}
                      </div>
                      <Badge variant="outline">{upcomingWorkout.workoutPlan.difficulty}</Badge>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/workout/${upcomingWorkout.workoutPlan.id}`}>
                        Start Workout
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No upcoming workout assigned
                    </p>
                    <Link href="/workout">
                      <Button variant="outline">Browse Workouts</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {log.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(log.date)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {log.workoutSets.length} sets
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">
                      No workout history yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Goals */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Calories Consumed</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalCalories.toLocaleString()} kcal
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Protein</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalProtein.toFixed(0)}g
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Carbs</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalCarbs.toFixed(0)}g
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Fat</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {totalFat.toFixed(0)}g
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Water Intake</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {(totalWater / 1000).toFixed(1)} L
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {member?.profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.profile.weightKg && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Weight</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.profile.weightKg} kg
                      </span>
                    </div>
                  )}
                  {member.profile.heightCm && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Height</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.profile.heightCm} cm
                      </span>
                    </div>
                  )}
                  {member.profile.bmi && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">BMI</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.profile.bmi.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {member.profile.goal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Goal</span>
                      <span className="font-semibold text-slate-900 dark:text-white capitalize">
                        {member.profile.goal.toLowerCase()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/nutrition">
                    Log Food
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/nutrition/water">
                    Add Water
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/progress">
                    Track Progress
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}