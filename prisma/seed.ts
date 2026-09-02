import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.systemSetting.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.progressPhoto.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.waterLog.deleteMany();
  await prisma.foodLog.deleteMany();
  await prisma.personalRecord.deleteMany();
  await prisma.workoutSet.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.workoutAssignment.deleteMany();
  await prisma.workoutPlanExercise.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.personalRecord.deleteMany();
  await prisma.assignedMembers.deleteMany();
  await prisma.assignedMembers.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.member.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.payment.deleteMany();

  console.log('✅ Cleared existing data');

  // Create System Settings
  const settings = [
    { key: 'GYM_NAME', value: 'FitLife Pro Gym', description: 'Gym Name', category: 'general' },
    { key: 'CONTACT_EMAIL', value: 'contact@fitlifepro.com', description: 'Contact Email', category: 'general' },
    { key: 'CONTACT_PHONE', value: '+91 98765 43210', description: 'Contact Phone', category: 'general' },
    { key: 'DEFAULT_LANGUAGE', value: 'ENGLISH', description: 'Default Language', category: 'general' },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ Created system settings');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fitlifepro.com',
      password: adminPassword,
      name: 'System Admin',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
    },
  });

  console.log('✅ Created admin user');

  // Create Trainer User
  const trainerPassword = await bcrypt.hash('trainer123', 10);
  const trainer = await prisma.user.create({
    data: {
      email: 'trainer@fitlifepro.com',
      password: trainerPassword,
      name: 'Rajesh Kumar',
      role: 'TRAINER',
      profile: {
        create: {
          firstName: 'Rajesh',
          lastName: 'Kumar',
          specialization: 'Bodybuilding & Strength',
          experienceYears: 8,
          certification: 'NASM Certified Personal Trainer',
          bio: 'Expert in hypertrophy training and nutrition planning with 8+ years of experience.',
          rating: 4.8,
          reviewCount: 45,
        },
      },
      createdAt: new Date(),
    },
  });

  console.log('✅ Created trainer user');

  // Create Members
  const membersData = [
    {
      name: 'Amit Sharma',
      email: 'amit@example.com',
      password: await bcrypt.hash('member123', 10),
      profile: {
        create: {
          firstName: 'Amit',
          lastName: 'Sharma',
          gender: 'MALE',
          phone: '+91 98765 43201',
          heightCm: 175,
          weightKg: 78,
          goal: 'MUSCLE_GAIN',
          activityLevel: 'ACTIVE',
          targetCalories: 2800,
          targetProtein: 180,
          targetCarbs: 320,
          targetFat: 85,
          dailyProtein: 160,
          dailyCarbs: 280,
          dailyFat: 75,
          dailyWaterMl: 3000,
          notes: 'Working towards building muscle mass. Motivated and consistent.',
        },
      },
    },
    {
      name: 'Priya Singh',
      email: 'priya@example.com',
      password: await bcrypt.hash('member123', 10),
      profile: {
        create: {
          firstName: 'Priya',
          lastName: 'Singh',
          gender: 'FEMALE',
          phone: '+91 98765 43202',
          heightCm: 165,
          weightKg: 62,
          goal: 'WEIGHT_LOSS',
          activityLevel: 'MODERATE',
          targetCalories: 1800,
          targetProtein: 100,
          targetCarbs: 180,
          targetFat: 55,
          dailyProtein: 90,
          dailyCarbs: 160,
          dailyFat: 45,
          dailyWaterMl: 2500,
          notes: 'Goal is to lose 5kg and improve fitness levels.',
        },
      },
    },
    {
      name: 'Vikram Patel',
      email: 'vikram@example.com',
      password: await bcrypt.hash('member123', 10),
      profile: {
        create: {
          firstName: 'Vikram',
          lastName: 'Patel',
          gender: 'MALE',
          phone: '+91 98765 43203',
          heightCm: 172,
          weightKg: 70,
          goal: 'STRENGTH',
          activityLevel: 'VERY_ACTIVE',
          targetCalories: 3200,
          targetProtein: 220,
          targetCarbs: 400,
          targetFat: 90,
          dailyProtein: 200,
          dailyCarbs: 350,
          dailyFat: 80,
          dailyWaterMl: 3500,
          notes: 'Powerlifting training. Focus on compound movements.',
        },
      },
    },
  ];

  const members = [];
  for (const memberData of membersData) {
    const member = await prisma.user.create({
      data: memberData,
    });
    members.push(member);
  }

  console.log(`✅ Created ${members.length} members`);

  // Assign trainers to members
  for (let i = 0; i < members.length; i++) {
    await prisma.member.create({
      data: {
        userId: members[i].id,
        trainerId: trainer.id,
        joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });
  }

  console.log('✅ Assigned trainers to members');

  // Create Membership Plans
  const plans = [
    {
      name: 'Basic',
      description: 'Access to gym equipment',
      type: 'BASIC',
      price: 999,
      durationDays: 30,
      features: ['ACCESS_GYM', 'APP_ACCESS'],
      isActive: true,
    },
    {
      name: 'Standard',
      description: 'Full gym access + group classes',
      type: 'STANDARD',
      price: 1999,
      durationDays: 30,
      features: ['ACCESS_GYM', 'PERSONAL_TRAINER', 'GROUP_CLASSES', 'NUTRITION_ADVICE', 'WEIGHT_TRACKING', 'APP_ACCESS'],
      isActive: true,
    },
    {
      name: 'Premium',
      description: 'Full gym + personal trainer + nutrition',
      type: 'PREMIUM',
      price: 4999,
      durationDays: 30,
      features: ['ACCESS_GYM', 'PERSONAL_TRAINER', 'GROUP_CLASSES', 'NUTRITION_ADVICE', 'WEIGHT_TRACKING', 'PROGRESS_PHOTOS', 'APP_ACCESS', 'PRIORITY_SLOTS', 'MASSAGE_THERAPY', 'TOWEL_SERVICE'],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.create({
      data: plan,
    });
  }

  console.log('✅ Created membership plans');

  // Create Memberships for users
  const premiumPlan = await prisma.membershipPlan.findFirst({ where: { type: 'PREMIUM' } });
  const standardPlan = await prisma.membershipPlan.findFirst({ where: { type: 'STANDARD' } });

  if (premiumPlan) {
    for (const member of members) {
      await prisma.membership.create({
        data: {
          userId: member.id,
          planId: premiumPlan.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          paymentStatus: 'COMPLETED',
          amountPaid: 4999,
          paymentMethod: 'CREDIT_CARD',
        },
      });
    }
  }

  if (standardPlan) {
    // One member gets standard plan
    await prisma.membership.create({
      data: {
        userId: members[0].id,
        planId: standardPlan.id,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'EXPIRING_SOON',
        paymentStatus: 'COMPLETED',
        amountPaid: 1999,
        paymentMethod: 'UPI',
      },
    });
  }

  console.log('✅ Created memberships');

  // Create Exercises
  const exercisesData = [
    {
      name: 'Bench Press',
      muscleGroup: 'CHEST',
      difficulty: 'INTERMEDIATE',
      equipment: 'BARBELL',
      isCompound: true,
      primaryMuscles: ['CHEST', 'TRICEPS', 'FRONT_DELTOIDS'],
      secondaryMuscles: ['TRAPS', 'CORE'],
      defaultSets: 4,
      defaultReps: 10,
      defaultRest: 90,
      instructions: 'Lie flat on bench, grip bar slightly wider than shoulder-width. Lower bar to chest and press up. Keep core engaged throughout.',
    },
    {
      name: 'Squat',
      muscleGroup: 'LEGS',
      difficulty: 'ADVANCED',
      equipment: 'BARBELL',
      isCompound: true,
      primaryMuscles: ['QUADRICEPS', 'GLUTES', 'HAMSTRINGS'],
      secondaryMuscles: ['CORE', 'ADDUCTORS', 'ABIKS'],
      defaultSets: 4,
      defaultReps: 8,
      defaultRest: 120,
      instructions: 'Bar resting on upper back. Squat down until thighs are parallel to floor. Drive through heels to return to starting position.',
    },
    {
      name: 'Deadlift',
      muscleGroup: 'BACK',
      difficulty: 'ADVANCED',
      equipment: 'BARBELL',
      isCompound: true,
      primaryMuscles: ['HAMSTRINGS', 'GLUTES', 'LATISSIMUS_DORSI', 'ERECTOR_SPINAE'],
      secondaryMuscles: ['TRAPS', 'BICEPS'],
      defaultSets: 4,
      defaultReps: 6,
      defaultRest: 180,
      instructions: 'Keep back flat, maintain neutral spine. Lift by driving through heels, keeping bar close to body throughout.',
    },
    {
      name: 'Overhead Press',
      muscleGroup: 'SHOULDERS',
      difficulty: 'INTERMEDIATE',
      equipment: 'BARBELL',
      isCompound: true,
      primaryMuscles: ['DELTOIDS', 'TRICEPS'],
      secondaryMuscles: ['CORE'],
      defaultSets: 4,
      defaultReps: 10,
      defaultRest: 90,
      instructions: 'Start with bar at shoulders. Press overhead until arms are fully extended. Control the weight on the way down.',
    },
    {
      name: 'Pull-ups',
      muscleGroup: 'BACK',
      difficulty: 'ADVANCED',
      equipment: 'BODYWEIGHT',
      isCompound: true,
      primaryMuscles: ['LATISSIMUS_DORSI', 'BICEPS'],
      secondaryMuscles: ['TRAPS', 'FOREARMS'],
      defaultSets: 4,
      defaultReps: 10,
      defaultRest: 60,
      instructions: 'Hang from bar, grip slightly wider than shoulders. Pull body up until chin clears bar. Lower with control.',
    },
    {
      name: 'Bicep Curl',
      muscleGroup: 'BICEPS',
      difficulty: 'BEGINNER',
      equipment: 'DUMBBELL',
      isCompound: false,
      primaryMuscles: ['BICEPS', 'BRACHIALIS'],
      secondaryMuscles: ['FOREARMS'],
      defaultSets: 3,
      defaultReps: 12,
      defaultRest: 60,
      instructions: 'Stand with dumbbells at sides. Curl weights up to shoulders, keeping elbows stationary. Lower with control.',
    },
    {
      name: 'Tricep Dips',
      muscleGroup: 'TRICEPS',
      difficulty: 'INTERMEDIATE',
      equipment: 'PARALLEL_BARS',
      isCompound: false,
      primaryMuscles: ['TRICEPS', 'PECTORALS'],
      secondaryMuscles: ['DELTOIDS'],
      defaultSets: 3,
      defaultReps: 12,
      defaultRest: 60,
      instructions: 'Support body on bars, lower until elbows are at 90 degrees. Push back up to starting position.',
    },
    {
      name: 'Lunges',
      muscleGroup: 'LEGS',
      difficulty: 'INTERMEDIATE',
      equipment: 'DUMBBELL',
      isCompound: true,
      primaryMuscles: ['QUADRICEPS', 'GLUTES', 'HAMSTRINGS'],
      secondaryMuscles: ['CALVES', 'CORE'],
      defaultSets: 3,
      defaultReps: 10,
      defaultRest: 60,
      instructions: 'Step forward into lunge, bending both knees to 90 degrees. Return to standing position. Alternate legs.',
    },
    {
      name: 'Plank',
      muscleGroup: 'CORE',
      difficulty: 'INTERMEDIATE',
      equipment: 'BODYWEIGHT',
      isCompound: false,
      primaryMuscles: ['CORE', 'TRANSVERSE_ABDOMINIS'],
      secondaryMuscles: ['DELTOIDS', 'GLUTES'],
      defaultSets: 3,
      defaultReps: 60,
      defaultRest: 30,
      instructions: 'Hold body in straight line from head to heels, resting on forearms and toes. Engage core throughout.',
    },
    {
      name: 'Running',
      muscleGroup: 'CARDIO',
      difficulty: 'BEGINNER',
      equipment: 'BODYWEIGHT',
      isCompound: true,
      primaryMuscles: ['CALVES', 'QUADRICEPS', 'GLUTES', 'HAMSTRINGS'],
      secondaryMuscles: ['CORE', 'LUNGS'],
      defaultSets: 0,
      defaultReps: 0,
      defaultRest: 60,
      instructions: 'Run at comfortable pace. Maintain good form with relaxed shoulders and short strides.',
    },
    {
      name: 'Jumping Jacks',
      muscleGroup: 'CARDIO',
      difficulty: 'BEGINNER',
      equipment: 'BODYWEIGHT',
      isCompound: true,
      primaryMuscles: ['CALVES', 'QUADRICEPS', 'GLUTES', 'HIP_FLEXORS'],
      secondaryMuscles: ['LUNGS', 'CORE'],
      defaultSets: 3,
      defaultReps: 30,
      defaultRest: 30,
      instructions: 'Start with feet together, arms at sides. Jump to spread feet while raising arms overhead. Return to start.',
    },
    {
      name: 'Burpees',
      muscleGroup: 'CARDIO',
      difficulty: 'ADVANCED',
      equipment: 'BODYWEIGHT',
      isCompound: true,
      primaryMuscles: ['QUADRICEPS', 'GLUTES', 'HAMSTRINGS', 'CALVES'],
      secondaryMuscles: ['CORE', 'DELTOIDS', 'TRICEPS'],
      defaultSets: 3,
      defaultReps: 10,
      defaultRest: 60,
      instructions: 'Start standing. Drop to squat position, kick feet back to push-up position, do push-up, return to squat, jump up.',
    },
  ];

  const exercises = [];
  for (const exerciseData of exercisesData) {
    const exercise = await prisma.exercise.create({
      data: exerciseData,
    });
    exercises.push(exercise);
  }

  console.log(`✅ Created ${exercises.length} exercises`);

  // Create Food Items (Indian foods)
  const foodsData = [
    {
      name: 'Roti (Whole Wheat)',
      servingSize: '2 pieces (approx 100g)',
      unit: 'piece',
      calories: 260,
      protein: 7,
      carbs: 48,
      fat: 3,
      fiber: 8,
      category: 'GRAINS',
    },
    {
      name: 'Basmati Rice',
      servingSize: '1 cup (cooked)',
      unit: 'cup',
      calories: 206,
      protein: 4,
      carbs: 45,
      fat: 0.4,
      fiber: 0.6,
      category: 'GRAINS',
    },
    {
      name: 'Chana Dal',
      servingSize: '100g (cooked)',
      unit: 'g',
      calories: 117,
      protein: 9,
      carbs: 20,
      fat: 0.7,
      fiber: 7,
      category: 'LEGUMES',
    },
    {
      name: 'Paneer (Cottage Cheese)',
      servingSize: '100g',
      unit: 'g',
      calories: 265,
      protein: 18,
      carbs: 3,
      fat: 20,
      fiber: 0,
      category: 'DAIRY',
    },
    {
      name: 'Curd (Yogurt)',
      servingSize: '200g (1 cup)',
      unit: 'g',
      calories: 98,
      protein: 10,
      carbs: 3.6,
      fat: 5.8,
      fiber: 0,
      category: 'DAIRY',
    },
    {
      name: 'Whole Milk',
      servingSize: '250ml',
      unit: 'ml',
      calories: 149,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 0,
      category: 'DAIRY',
    },
    {
      name: 'Egg (Whole)',
      servingSize: '1 medium',
      unit: 'piece',
      calories: 78,
      protein: 6,
      carbs: 0.6,
      fat: 5,
      fiber: 0,
      category: 'PROTEIN',
    },
    {
      name: 'Egg White',
      servingSize: '1 large',
      unit: 'piece',
      calories: 17,
      protein: 3.6,
      carbs: 0.2,
      fat: 0,
      fiber: 0,
      category: 'PROTEIN',
    },
    {
      name: 'Chicken Breast (Cooked)',
      servingSize: '100g',
      unit: 'g',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      category: 'PROTEIN',
    },
    {
      name: 'Fish (Cooked)',
      servingSize: '100g',
      unit: 'g',
      calories: 206,
      protein: 22,
      carbs: 0,
      fat: 12,
      fiber: 0,
      category: 'PROTEIN',
    },
    {
      name: 'Soya Chunks',
      servingSize: '100g (dry)',
      unit: 'g',
      calories: 345,
      protein: 52,
      carbs: 14,
      fat: 17,
      fiber: 9,
      category: 'PROTEIN',
    },
    {
      name: 'Oats',
      servingSize: '50g (dry)',
      unit: 'g',
      calories: 190,
      protein: 6,
      carbs: 34,
      fat: 3,
      fiber: 8,
      category: 'GRAINS',
    },
    {
      name: 'Poha',
      servingSize: '1 plate (approx 200g)',
      unit: 'g',
      calories: 222,
      protein: 5,
      carbs: 45,
      fat: 1.5,
      fiber: 2,
      category: 'GRAINS',
    },
    {
      name: 'Upma',
      servingSize: '1 plate (approx 200g)',
      unit: 'g',
      calories: 200,
      protein: 5,
      carbs: 38,
      fat: 3,
      fiber: 2,
      category: 'GRAINS',
    },
    {
      name: 'Idli',
      servingSize: '2 pieces (approx 100g)',
      unit: 'piece',
      calories: 117,
      protein: 4,
      carbs: 24,
      fat: 1,
      fiber: 1,
      category: 'GRAINS',
    },
    {
      name: 'Dosa',
      servingSize: '1 large (approx 150g)',
      unit: 'piece',
      calories: 170,
      protein: 3,
      carbs: 33,
      fat: 1,
      fiber: 1,
      category: 'GRAINS',
    },
    {
      name: 'Banana',
      servingSize: '1 medium',
      unit: 'piece',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3,
      category: 'FRUITS',
    },
    {
      name: 'Apple',
      servingSize: '1 medium',
      unit: 'piece',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4.4,
      category: 'FRUITS',
    },
    {
      name: 'Almonds',
      servingSize: '10 pieces (approx 25g)',
      unit: 'piece',
      calories: 145,
      protein: 6,
      carbs: 5,
      fat: 13,
      fiber: 3,
      category: 'NUTS',
    },
    {
      name: 'Peanuts',
      servingSize: '1 oz (approx 28g)',
      unit: 'piece',
      calories: 161,
      protein: 7,
      carbs: 5,
      fat: 14,
      fiber: 2,
      category: 'NUTS',
    },
    {
      name: 'Whey Protein',
      servingSize: '1 scoop (30g)',
      unit: 'g',
      calories: 120,
      protein: 24,
      carbs: 3,
      fat: 1,
      fiber: 0,
      category: 'SUPPLEMENTS',
    },
    {
      name: 'Bread (Whole Wheat)',
      servingSize: '2 slices',
      unit: 'slice',
      calories: 160,
      protein: 5,
      carbs: 30,
      fat: 1,
      fiber: 2,
      category: 'GRAINS',
    },
    {
      name: 'Broccoli',
      servingSize: '100g (cooked)',
      unit: 'g',
      calories: 55,
      protein: 3.7,
      carbs: 11,
      fat: 0.6,
      fiber: 5,
      category: 'VEGETABLES',
    },
    {
      name: 'Spinach (Palak)',
      servingSize: '100g (cooked)',
      unit: 'g',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      category: 'VEGETABLES',
    },
  ];

  for (const foodData of foodsData) {
    await prisma.foodItem.create({
      data: foodData,
    });
  }

  console.log(`✅ Created ${foodsData.length} food items`);

  // Create Workout Plan
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      trainerId: trainer.id,
      name: 'Hypertrophy Program',
      description: '8-week muscle building program',
      category: 'STRENGTH',
      durationMin: 60,
      difficulty: 'INTERMEDIATE',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  // Add exercises to workout plan
  const benchPress = exercises.find((e) => e.name === 'Bench Press');
  const squat = exercises.find((e) => e.name === 'Squat');
  const overheadPress = exercises.find((e) => e.name === 'Overhead Press');
  const deadlift = exercises.find((e) => e.name === 'Deadlift');
  const pullUps = exercises.find((e) => e.name === 'Pull-ups');
  const lunge = exercises.find((e) => e.name === 'Lunges');
  const bicepCurl = exercises.find((e) => e.name === 'Bicep Curl');
  const tricepDips = exercises.find((e) => e.name === 'Tricep Dips');

  if (benchPress && squat && overheadPress && deadlift && pullUps && lunge && bicepCurl && tricepDips) {
    await prisma.workoutPlanExercise.createMany({
      data: [
        { workoutPlanId: workoutPlan.id, exerciseId: benchPress.id, order: 1, sets: 4, reps: 10, restTime: 90 },
        { workoutPlanId: workoutPlan.id, exerciseId: squat.id, order: 2, sets: 4, reps: 8, restTime: 120 },
        { workoutPlanId: workoutPlan.id, exerciseId: overheadPress.id, order: 3, sets: 4, reps: 10, restTime: 90 },
        { workoutPlanId: workoutPlan.id, exerciseId: deadlift.id, order: 4, sets: 4, reps: 6, restTime: 180 },
        { workoutPlanId: workoutPlan.id, exerciseId: pullUps.id, order: 5, sets: 4, reps: 10, restTime: 60 },
        { workoutPlanId: workoutPlan.id, exerciseId: lunge.id, order: 6, sets: 3, reps: 10, restTime: 60 },
        { workoutPlanId: workoutPlan.id, exerciseId: bicepCurl.id, order: 7, sets: 3, reps: 12, restTime: 60 },
        { workoutPlanId: workoutPlan.id, exerciseId: tricepDips.id, order: 8, sets: 3, reps: 12, restTime: 60 },
      ],
    });
  }

  console.log('✅ Created workout plan');

  // Assign workout plan to members
  for (const member of members) {
    await prisma.workoutAssignment.create({
      data: {
        workoutPlanId: workoutPlan.id,
        userId: member.id,
        dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('✅ Assigned workout plans to members');

  // Create initial measurements
  for (const member of members) {
    await prisma.measurement.create({
      data: {
        userId: member.id,
        weightKg: member.profile?.weightKg || 70,
        chestCm: 100,
        waistCm: 85,
        hipCm: 95,
        armCm: 35,
        thighCm: 55,
        calfCm: 38,
      },
    });
  }

  console.log('✅ Created initial measurements');

  // Create sample food logs
  const morningMeal = await prisma.foodItem.findFirst({ where: { name: 'Oats' } });
  const lunchMeal = await prisma.foodItem.findFirst({ where: { name: 'Chicken Breast' } });
  const dinnerMeal = await prisma.foodItem.findFirst({ where: { name: 'Roti' } });
  const snackMeal = await prisma.foodItem.findFirst({ where: { name: 'Banana' } });

  if (members[0]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (morningMeal) {
      await prisma.foodLog.create({
        data: {
          userId: members[0].id,
          foodId: morningMeal.id,
          mealType: 'BREAKFAST',
          quantity: 75, // 75g oats
        },
      });
    }

    if (lunchMeal) {
      await prisma.foodLog.create({
        data: {
          userId: members[0].id,
          foodId: lunchMeal.id,
          mealType: 'LUNCH',
          quantity: 150,
        },
      });
    }

    if (dinnerMeal) {
      await prisma.foodLog.create({
        data: {
          userId: members[0].id,
          foodId: dinnerMeal.id,
          mealType: 'DINNER',
          quantity: 3,
        },
      });
    }

    if (snackMeal) {
      await prisma.foodLog.create({
        data: {
          userId: members[0].id,
          foodId: snackMeal.id,
          mealType: 'SNACK',
          quantity: 1,
        },
      });
    }

    // Add water logs
    await prisma.waterLog.create({
      data: {
        userId: members[0].id,
        amountMl: 500,
      },
    });

    await prisma.waterLog.create({
      data: {
        userId: members[0].id,
        amountMl: 500,
      },
    });

    // Create attendance
    await prisma.attendance.create({
      data: {
        userId: members[0].id,
        memberId: members[0].id,
        checkIn: new Date(today),
        location: 'Main Gym',
      },
    });
  }

  console.log('✅ Created sample food logs and water intake');

  // Create sample personal records
  const benchRecord = await prisma.personalRecord.create({
    data: {
      userId: members[0].id,
      exerciseId: benchPress?.id || '',
      type: 'BEST_WEIGHT',
      value: 70,
      date: new Date(),
    },
  });

  const squatRecord = await prisma.personalRecord.create({
    data: {
      userId: members[0].id,
      exerciseId: squat?.id || '',
      type: 'BEST_WEIGHT',
      value: 100,
      date: new Date(),
    },
  });

  console.log('✅ Created sample personal records');

  // Create sample progress photos
  const progressPhoto = await prisma.progressPhoto.create({
    data: {
      userId: members[0].id,
      category: 'FRONT',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      description: 'Starting point',
    },
  });

  console.log('✅ Created sample progress photo');

  // Create notifications
  const notifications = [
    {
      userId: members[0].id,
      type: 'WORKOUT_REMINDER',
      title: 'Time for your workout!',
      message: 'Your scheduled workout is today. Don\'t forget to log your sets and reps.',
      link: '/workout',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      userId: members[0].id,
      type: 'MEMBERSHIP_EXPIRING',
      title: 'Membership expiring soon',
      message: 'Your premium membership will expire in 3 days. Renew now to continue accessing all features.',
      link: '/membership',
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const notificationData of notifications) {
    await prisma.notification.create({
      data: notificationData,
    });
  }

  console.log('✅ Created sample notifications');

  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('👤 Admin credentials:');
  console.log('   Email: admin@fitlifepro.com');
  console.log('   Password: admin123\n');
  console.log('👤 Trainer credentials:');
  console.log('   Email: trainer@fitlifepro.com');
  console.log('   Password: trainer123\n');
  console.log('👤 Member credentials (example 1):');
  console.log('   Email: amit@example.com');
  console.log('   Password: member123\n');
  console.log('👤 Member credentials (example 2):');
  console.log('   Email: priya@example.com');
  console.log('   Password: member123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });