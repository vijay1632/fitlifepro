"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trainers, Scale, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { today } from "@internationalized/date";

export default function ProgressPage() {
  const t = useTranslations("progress");
  const { toast } = useToast();
  const session = useSession();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [arm, setArm] = useState("");
  const [thigh, setThigh] = useState("");
  const [calf, setCalf] = useState("");

  const [recentMeasurements, setRecentMeasurements] = useState<any[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!session.data?.user) return;

    const userId = session.data.user.id;

    // Get recent measurements
    const measurements = await prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    });

    setRecentMeasurements(measurements);

    // Get latest weight
    const latestWeight = measurements.find(m => m.weightKg);
    if (latestWeight) {
      setCurrentWeight(latestWeight.weightKg);
    }
  };

  const handleSaveMeasurement = async () => {
    try {
      await prisma.measurement.create({
        data: {
          userId: session.data?.user.id,
          weightKg: weight ? parseFloat(weight) : null,
          bodyFatPercent: bodyFat ? parseFloat(bodyFat) : null,
          chestCm: chest ? parseFloat(chest) : null,
          waistCm: waist ? parseFloat(waist) : null,
          hipCm: hip ? parseFloat(hip) : null,
          armCm: arm ? parseFloat(arm) : null,
          thighCm: thigh ? parseFloat(thigh) : null,
          calfCm: calf ? parseFloat(calf) : null,
        },
      });

      toast({
        title: "Success",
        description: "Measurement saved successfully!",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save measurement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t("trackYourChanges")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("weight")}
            </CardTitle>
            <Scale className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentWeight ? `${currentWeight} kg` : "--"}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("yourWeightProgress")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("bodyFat")}
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {recentMeasurements.length > 0 ? `${recentMeasurements[0].bodyFatPercent?.toFixed(1)}%` : "--"}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Body Fat % Change
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("measurements")}
            </CardTitle>
            <Trainers className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {recentMeasurements.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("totalRecords")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("addMeasurement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>{t("weight")}</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("bodyFat")}</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="15.0"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Chest (cm)</Label>
              <Input
                type="number"
                placeholder="100"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Waist (cm)</Label>
              <Input
                type="number"
                placeholder="85"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Hip (cm)</Label>
              <Input
                type="number"
                placeholder="95"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Arm (cm)</Label>
              <Input
                type="number"
                placeholder="35"
                value={arm}
                onChange={(e) => setArm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Thigh (cm)</Label>
              <Input
                type="number"
                placeholder="55"
                value={thigh}
                onChange={(e) => setThigh(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Calf (cm)</Label>
              <Input
                type="number"
                placeholder="38"
                value={calf}
                onChange={(e) => setCalf(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveMeasurement}>
              {t("saveChanges")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>{t("history")}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMeasurements.length > 0 ? (
            <div className="space-y-4">
              {recentMeasurements.map((measurement, index) => (
                <div
                  key={measurement.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(measurement.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-8">
                    {measurement.weightKg && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Weight</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {measurement.weightKg} kg
                        </p>
                      </div>
                    )}
                    {measurement.bodyFatPercent && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Body Fat</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {measurement.bodyFatPercent}%
                        </p>
                      </div>
                    )}
                    {measurement.chestCm && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Chest</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {measurement.chestCm} cm
                        </p>
                      </div>
                    )}
                    {measurement.waistCm && (
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Waist</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {measurement.waistCm} cm
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                {t("noMeasurements")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                {t("addFirstMeasurement")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}