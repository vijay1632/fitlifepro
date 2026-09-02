"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Water } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { today } from "@internationalized/date";

export default function NutritionPage() {
  const t = useTranslations("nutrition");
  const { toast } = useToast();
  const session = useSession();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [mealType, setMealType] = useState("LUNCH");
  const [selectedWater, setSelectedWater] = useState("250");

  const [dailyStats, setDailyStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // Fetch daily stats and logs on mount
  const fetchData = async () => {
    if (!session.data?.user) return;

    const userId = session.data.user.id;

    // Get today's food logs
    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId,
        date: todayDate,
      },
      include: {
        food: true,
      },
    });

    const totalCalories = foodLogs.reduce((sum, log) => sum + log.food.calories * log.quantity, 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + log.food.protein * log.quantity, 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + log.food.carbs * log.quantity, 0);
    const totalFat = foodLogs.reduce((sum, log) => sum + log.food.fat * log.quantity, 0);

    setDailyStats({
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      water: 0,
    });

    // Get recent logs
    setRecentLogs(foodLogs.slice(-5).reverse());
  };

  if (typeof window !== "undefined") {
    fetchData();
  }

  const handleAddFood = async () => {
    if (!selectedFood || !quantity) {
      toast({
        title: "Error",
        description: "Please select food and quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      const food = await prisma.foodItem.findUnique({
        where: { id: selectedFood },
      });

      if (!food) {
        toast({
          title: "Error",
          description: "Food not found",
          variant: "destructive",
        });
        return;
      }

      await prisma.foodLog.create({
        data: {
          userId: session.data?.user.id,
          foodId: selectedFood,
          mealType: mealType as any,
          quantity: parseFloat(quantity),
          notes: "Added from food log",
        },
      });

      toast({
        title: "Success",
        description: "Food added successfully!",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add food",
        variant: "destructive",
      });
    }
  };

  const handleAddWater = async () => {
    if (!selectedWater) {
      toast({
        title: "Error",
        description: "Please select water amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const amountMl = parseInt(selectedWater);

      // Check if water log exists for today
      const existingLog = await prisma.waterLog.findFirst({
        where: {
          userId: session.data?.user.id,
          date: todayDate,
        },
      });

      if (existingLog) {
        await prisma.waterLog.update({
          where: { id: existingLog.id },
          data: { amountMl: existingLog.amountMl + amountMl },
        });
      } else {
        await prisma.waterLog.create({
          data: {
            userId: session.data?.user.id,
            amountMl,
          },
        });
      }

      toast({
        title: "Success",
        description: "Water intake added!",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add water",
        variant: "destructive",
      });
    }
  };

  const foodOptions = [
    { id: "food_1", name: "Roti (1 piece)", calories: 130 },
    { id: "food_2", name: "Rice (1 cup)", calories: 205 },
    { id: "food_3", name: "Dal (100g)", calories: 117 },
    { id: "food_4", name: "Paneer (100g)", calories: 265 },
    { id: "food_5", name: "Egg (Whole)", calories: 78 },
    { id: "food_6", name: "Chicken Breast (100g)", calories: 165 },
    { id: "food_7", name: "Banana (1 medium)", calories: 105 },
    { id: "food_8", name: "Oats (50g)", calories: 190 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t("trackYourNutrition")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("todayTotal")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">{t("calories")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {dailyStats.calories} kcal
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${Math.min(dailyStats.calories / 2000 * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">{t("protein")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {dailyStats.protein.toFixed(0)}g
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${Math.min(dailyStats.protein / 160 * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">{t("carbs")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {dailyStats.carbs.toFixed(0)}g
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min(dailyStats.carbs / 250 * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">{t("fat")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {dailyStats.fat.toFixed(0)}g
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${Math.min(dailyStats.fat / 70 * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2">
                <Water className="h-4 w-4 text-cyan-500" />
                <span className="text-slate-600 dark:text-slate-400">{t("waterIntake")}</span>
                <span className="font-semibold text-slate-900 dark:text-white ml-auto">
                  {dailyStats.water} ml
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Food */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("addFood")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("foodName")}</Label>
                  <Select value={selectedFood} onValueChange={setSelectedFood}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectFood")} />
                    </SelectTrigger>
                    <SelectContent>
                      {foodOptions.map((food) => (
                        <SelectItem key={food.id} value={food.id}>
                          {food.name} ({food.calories} kcal)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("quantity")}</Label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("mealType")}</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BREAKFAST">{t("mealTypeBreakfast")}</SelectItem>
                      <SelectItem value="LUNCH">{t("mealTypeLunch")}</SelectItem>
                      <SelectItem value="DINNER">{t("mealTypeDinner")}</SelectItem>
                      <SelectItem value="SNACK">{t("mealTypeSnack")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-end">
                <Button onClick={handleAddFood} className="w-full" size="lg">
                  {t("addFoodToLog")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Food Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Food Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {log.food.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("mealType" + log.mealType)} • {log.quantity} × {log.food.calories} kcal
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {Math.round(log.food.calories * log.quantity)} kcal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                {t("noFoodLogged")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                {t("addYourFirstFood")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}