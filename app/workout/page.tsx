import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function WorkoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;

  // Get user's upcoming workouts
  const upcomingWorkouts = await prisma.workoutAssignment.findMany({
    where: {
      userId,
      isCompleted: false,
      dueDate: {
        gte: new Date(),
      },
    },
    include: {
      workoutPlan: {
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  // Get workout history
  const workoutHistory = await prisma.workoutLog.findMany({
    where: {
      userId,
      isCompleted: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
    include: {
      workoutSets: {
        include: {
          exercise: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Workout
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Plan and track your fitness training
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Workouts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Workouts</CardTitle>
              <Badge variant="secondary">
                {upcomingWorkouts.length} assigned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingWorkouts.length > 0 ? (
              upcomingWorkouts.map((assignment) => (
                <Card key={assignment.id} className="border-l-4 border-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {assignment.workoutPlan.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {assignment.workoutPlan.exercises.length} exercises
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Calendar className="h-4 w-4" />
                            {formatDate(assignment.dueDate)}
                          </div>
                          <Badge variant="outline">
                            {assignment.workoutPlan.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <a href={`/workout/${assignment.workoutPlan.id}`}>
                          Start
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No upcoming workouts
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="#">Browse Workout Plans</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            {workoutHistory.length > 0 ? (
              <div className="space-y-4">
                {workoutHistory.map((log) => (
                  <Card key={log.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {log.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {formatDate(log.date)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {log.workoutSets.length} sets
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No workout history yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Start tracking your exercises right away
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4">
              <Dumbbell className="h-6 w-6 mr-3" />
              <div className="text-left">
                <p className="font-semibold">Log Exercise</p>
                <p className="text-sm text-slate-500">Record your sets and reps</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4">
              <Calendar className="h-6 w-6 mr-3" />
              <div className="text-left">
                <p className="font-semibold">Schedule Workout</p>
                <p className="text-sm text-slate-500">Plan your training session</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4">
              <TrendingUp className="h-6 w-6 mr-3" />
              <div className="text-left">
                <p className="font-semibold">Check Progress</p>
                <p className="text-sm text-slate-500">View your personal records</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}