import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function getBMI(weightKg: number, heightCm: number): number {
  if (heightCm === 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMIStatus(bmi: number): {
  category: string;
  color: string;
} {
  if (bmi < 18.5) {
    return { category: "Underweight", color: "text-yellow-600" };
  } else if (bmi < 25) {
    return { category: "Normal weight", color: "text-green-600" };
  } else if (bmi < 30) {
    return { category: "Overweight", color: "text-orange-600" };
  } else {
    return { category: "Obese", color: "text-red-600" };
  }
}

export function calculateCaloriesBurned(weightKg: number, durationMin: number, intensity: "light" | "moderate" | "vigorous"): number {
  const MET = {
    light: 3.5,
    moderate: 5,
    vigorous: 7.5,
  }[intensity];

  return Math.round(weightKg * MET * durationMin / 60);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function calculateProteinFromGrams(grams: number, type: "whole" | "white"): number {
  if (type === "white") {
    return grams * 0.11; // Egg white: 11g protein per 100g
  } else {
    return grams * 0.13; // Whole egg: 13g protein per 100g
  }
}

export function calculateMacros(
  calories: number,
  proteinPercent: number,
  carbsPercent: number,
  fatPercent: number
): {
  protein: number;
  carbs: number;
  fat: number;
} {
  return {
    protein: Math.round((calories * proteinPercent) / 100 / 4),
    carbs: Math.round((calories * carbsPercent) / 100 / 4),
    fat: Math.round((calories * fatPercent) / 100 / 9),
  };
}