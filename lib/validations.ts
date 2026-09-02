import { z } from "zod";

// Auth validations
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile validations
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  heightCm: z.number().int().positive("Height must be positive").optional(),
  weightKg: z.number().min(20).max(500, "Weight must be between 20 and 500kg").optional(),
  dateOfBirth: z.coerce.date().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
});

// Membership validations
export const membershipSchema = z.object({
  planId: z.string().uuid("Invalid plan"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  amountPaid: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "UPI", "CASH", "ONLINE"]),
  notes: z.string().optional(),
});

// Workout validations
export const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  type: z.string().optional(),
  durationMin: z.number().int().positive("Duration must be positive").optional(),
  notes: z.string().optional(),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  muscleGroup: z.enum(["CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS", "LEGS", "GLUTES", "CALVES", "CORE", "CARDIO", "FULL_BODY"]),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  equipment: z.string().optional(),
  instructions: z.string().optional(),
  defaultSets: z.number().int().min(1).max(10),
  defaultReps: z.number().int().min(1).max_99("Reps cannot exceed 99"),
  defaultRest: z.number().int().min(0).max_600("Rest time cannot exceed 600 seconds"),
});

export const workoutLogSchema = z.object({
  workoutPlanId: z.string().uuid("Invalid workout plan").optional(),
  name: z.string().min(1, "Workout name is required"),
  type: z.string().optional(),
  durationMin: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export const workoutSetSchema = z.object({
  workoutLogId: z.string().uuid("Invalid workout log"),
  exerciseId: z.string().uuid("Invalid exercise"),
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(0),
  weightKg: z.number().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Nutrition validations
export const foodLogSchema = z.object({
  foodId: z.string().uuid("Invalid food"),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  quantity: z.number().positive("Quantity must be positive"),
  notes: z.string().optional(),
});

export const foodSchema = z.object({
  name: z.string().min(1, "Food name is required"),
  servingSize: z.string().min(1, "Serving size is required"),
  unit: z.enum(["g", "ml", "piece", "cup", "oz"]),
  calories: z.number().positive("Calories must be positive"),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
});

export const waterLogSchema = z.object({
  amountMl: z.number().int().positive("Amount must be positive"),
  bottleCount: z.number().int().min(0).optional(),
  glassesCount: z.number().int().min(0).optional(),
});

// Progress validations
export const measurementSchema = z.object({
  weightKg: z.number().min(20).max(500).optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  chestCm: z.number().min(50).max_200("Chest must be between 50 and 200cm").optional(),
  waistCm: z.number().min(50).max_200("Waist must be between 50 and 200cm").optional(),
  hipCm: z.number().min(50).max_200("Hip must be between 50 and 200cm").optional(),
  armCm: z.number().min(50).max_200("Arm must be between 50 and 200cm").optional(),
  thighCm: z.number().min(50).max_200("Thigh must be between 50 and 200cm").optional(),
  calfCm: z.number().min(50).max_200("Calf must be between 50 and 200cm").optional(),
});

// Attendance validations
export const attendanceSchema = z.object({
  memberId: z.string().uuid("Invalid member"),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date().optional(),
  location: z.string().optional(),
});

// Payments
export const paymentSchema = z.object({
  membershipId: z.string().uuid("Invalid membership"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["INR"]),
  paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "UPI", "CASH", "ONLINE"]),
  transactionId: z.string().optional(),
});