import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, TrendingUp } from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;

  // Get user's memberships
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: {
      plan: true,
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { startDate: "desc" },
  });

  // Get active membership
  const activeMembership = memberships.find(m => m.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Membership
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage your fitness journey with premium membership
        </p>
      </div>

      {activeMembership ? (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Active Membership
                </CardTitle>
                <CardDescription className="mt-2">
                  {activeMembership.plan.name}
                </CardDescription>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">
                {activeMembership.plan.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  Active
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Join date
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(activeMembership.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Expiry date
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(activeMembership.endDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Price
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(activeMembership.amountPaid, "INR")}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Plan Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activeMembership.plan.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="justify-start">
                    ✓ {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Payment History
              </h3>
              {activeMembership.payments.length > 0 ? (
                <div className="space-y-2">
                  {activeMembership.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formatCurrency(payment.amount, "INR")}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <Badge className="border-transparent bg-emerald-600 text-white hover:bg-emerald-600">
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No payment history
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Membership</CardTitle>
            <CardDescription>
              You don&apos;t have an active membership. Upgrade to enjoy all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Plan</CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    {formatCurrency(999, "INR")}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      /month
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Gym Access
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      App Access
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Standard Plan</CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    {formatCurrency(1999, "INR")}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      /month
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      All Basic Features
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Group Classes
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Nutrition Advice
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium Plan</CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    {formatCurrency(4999, "INR")}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      /month
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      All Standard Features
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Personal Trainer
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Weekly Reports
                    </li>
                  </ul>
                  <Button className="w-full" asChild>
                    <a href="#">Upgrade Now</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
