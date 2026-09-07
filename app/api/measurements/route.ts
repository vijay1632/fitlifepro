import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const measurementFields = ["weightKg", "bodyFatPercent", "chestCm", "waistCm", "hipCm", "armCm", "thighCm", "calfCm"] as const;

async function currentUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const measurements = await prisma.measurement.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 10 });
  return NextResponse.json({ measurements });
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = Object.fromEntries(
      measurementFields.map((field) => {
        const raw = body[field];
        if (raw === "" || raw === null || raw === undefined) return [field, null];
        const value = Number(raw);
        return [field, Number.isFinite(value) && value >= 0 && value < 1000 ? value : undefined];
      }),
    );
    if (Object.values(data).some((value) => value === undefined) || Object.values(data).every((value) => value === null)) {
      return NextResponse.json({ error: "Add at least one valid measurement." }, { status: 400 });
    }

    const measurement = await prisma.measurement.create({ data: { userId, ...data } });
    return NextResponse.json({ measurement }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save this measurement." }, { status: 500 });
  }
}
