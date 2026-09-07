"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Food = { id: string; name: string; servingSize: string; calories: number };
type FoodLog = { id: string; mealType: string; quantity: number; food: Food };
type NutritionData = { foods: Food[]; logs: FoodLog[]; stats: { calories: number; protein: number; carbs: number; fat: number; water: number } };

const targets = [["Calories", "calories", 2000, "kcal", "bg-orange-500"], ["Protein", "protein", 160, "g", "bg-blue-500"], ["Carbs", "carbs", 250, "g", "bg-emerald-500"], ["Fat", "fat", 70, "g", "bg-amber-500"]] as const;

export default function NutritionPage() {
  const { toast } = useToast();
  const [data, setData] = useState<NutritionData | null>(null);
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [mealType, setMealType] = useState("LUNCH");
  const [isSaving, setIsSaving] = useState(false);
  const load = useCallback(async () => { const response = await fetch("/api/nutrition", { cache: "no-store" }); if (response.ok) setData(await response.json()); }, []);
  useEffect(() => { void load(); }, [load]);

  async function save(body: Record<string, unknown>, success: string) {
    setIsSaving(true);
    try {
      const response = await fetch("/api/nutrition", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      toast({ title: "Saved", description: success });
      await load();
    } catch (error) {
      toast({ title: "Couldn’t save", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally { setIsSaving(false); }
  }

  return <div className="space-y-6 page-enter">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Daily fuel</p><h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Nutrition</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Small, consistent choices add up.</p></div><Button variant="outline" onClick={() => void save({ type: "water", amountMl: 250 }, "250 ml added to today’s hydration.")} disabled={isSaving}><Droplets className="mr-2 h-4 w-4" /> Add 250 ml water</Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{targets.map(([label, key, target, unit, color], index) => { const value = data?.stats[key] ?? 0; return <Card key={key} className="motion-card" style={{ animationDelay: `${index * 70}ms` }}><CardContent className="pt-6"><div className="flex items-baseline justify-between"><p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p><span className="text-xs text-slate-500">{target} {unit}</span></div><p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{Math.round(value)} <span className="text-sm font-medium text-slate-500">{unit}</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`${color} progress-fill h-full rounded-full`} style={{ width: `${Math.min((value / target) * 100, 100)}%` }} /></div></CardContent></Card>; })}</div>
    <div className="grid gap-6 lg:grid-cols-5"><Card className="lg:col-span-2 motion-card" style={{ animationDelay: "280ms" }}><CardHeader><CardTitle>Log a meal</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="food">Food</Label><Select value={selectedFood} onValueChange={setSelectedFood}><SelectTrigger id="food"><SelectValue placeholder="Choose a food" /></SelectTrigger><SelectContent>{data?.foods.map((food) => <SelectItem key={food.id} value={food.id}>{food.name} · {Math.round(food.calories)} kcal / {food.servingSize}</SelectItem>)}</SelectContent></Select></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="quantity">Servings</Label><Input id="quantity" type="number" min="0.25" max="20" step="0.25" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="meal">Meal</Label><Select value={mealType} onValueChange={setMealType}><SelectTrigger id="meal"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="BREAKFAST">Breakfast</SelectItem><SelectItem value="LUNCH">Lunch</SelectItem><SelectItem value="DINNER">Dinner</SelectItem><SelectItem value="SNACK">Snack</SelectItem></SelectContent></Select></div></div><Button className="w-full" disabled={!selectedFood || isSaving} onClick={() => void save({ foodId: selectedFood, quantity: Number(quantity), mealType }, "Your meal is in today’s log.")}><Plus className="mr-2 h-4 w-4" /> Add to today</Button></CardContent></Card>
    <Card className="lg:col-span-3 motion-card" style={{ animationDelay: "350ms" }}><CardHeader><CardTitle>Today’s meals</CardTitle></CardHeader><CardContent>{data?.logs.length ? <div className="space-y-2">{data.logs.map((log) => <div key={log.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"><div><p className="font-medium text-slate-900 dark:text-white">{log.food.name}</p><p className="text-sm text-slate-500">{log.mealType.toLowerCase()} · {log.quantity} serving{log.quantity === 1 ? "" : "s"}</p></div><p className="font-semibold text-slate-900 dark:text-white">{Math.round(log.food.calories * log.quantity)} kcal</p></div>)}</div> : <div className="py-12 text-center text-slate-500">Your food log is clear for today. Start with your next meal.</div>}</CardContent></Card></div>
  </div>;
}
