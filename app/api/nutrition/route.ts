import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { MealType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

async function currentUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { start, end } = todayRange();
  const [foods, logs, waterLogs] = await Promise.all([
    prisma.foodItem.findMany({ orderBy: { name: "asc" }, take: 100 }),
    prisma.foodLog.findMany({
      where: { userId, date: { gte: start, lt: end } },
      include: { food: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.waterLog.findMany({ where: { userId, date: { gte: start, lt: end } } }),
  ]);

  const stats = logs.reduce(
    (total, log) => ({
      calories: total.calories + log.food.calories * log.quantity,
      protein: total.protein + log.food.protein * log.quantity,
      carbs: total.carbs + log.food.carbs * log.quantity,
      fat: total.fat + log.food.fat * log.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return NextResponse.json({
    foods,
    logs,
    stats: { ...stats, water: waterLogs.reduce((sum, log) => sum + log.amountMl, 0) },
  });
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (body.type === "water") {
      const amountMl = Number(body.amountMl);
      if (!Number.isInteger(amountMl) || amountMl < 1 || amountMl > 5000) {
        return NextResponse.json({ error: "Enter a water amount between 1 and 5,000 ml." }, { status: 400 });
      }

      const { start, end } = todayRange();
      const existing = await prisma.waterLog.findFirst({ where: { userId, date: { gte: start, lt: end } } });
      if (existing) {
        await prisma.waterLog.update({ where: { id: existing.id }, data: { amountMl: { increment: amountMl } } });
      } else {
        await prisma.waterLog.create({ data: { userId, amountMl } });
      }
    } else {
      const quantity = Number(body.quantity);
      if (!Object.values(MealType).includes(body.mealType) || !Number.isFinite(quantity) || quantity <= 0 || quantity > 20) {
        return NextResponse.json({ error: "Check the meal details and try again." }, { status: 400 });
      }
      const food = await prisma.foodItem.findUnique({ where: { id: body.foodId } });
      if (!food) return NextResponse.json({ error: "The selected food is no longer available." }, { status: 404 });
      await prisma.foodLog.create({ data: { userId, foodId: food.id, mealType: body.mealType, quantity } });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save this entry." }, { status: 500 });
  }
}
