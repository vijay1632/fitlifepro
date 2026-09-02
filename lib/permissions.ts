import { UserRole } from '@prisma/client';

export type Permission =
  | 'viewDashboard'
  | 'manageUsers'
  | 'manageMembers'
  | 'manageTrainers'
  | 'viewAttendance'
  | 'manageAttendance'
  | 'manageMemberships'
  | 'viewReports'
  | 'manageReports'
  | 'manageSettings'
  | 'createWorkout'
  | 'assignWorkout'
  | 'viewMembers'
  | 'viewNutrition'
  | 'viewProgress'
  | 'manageNutrition'
  | 'manageProgress';

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'viewDashboard',
    'manageUsers',
    'manageMembers',
    'manageTrainers',
    'viewAttendance',
    'manageAttendance',
    'manageMemberships',
    'viewReports',
    'manageReports',
    'manageSettings',
    'createWorkout',
    'assignWorkout',
    'viewMembers',
    'viewNutrition',
    'viewProgress',
    'manageNutrition',
    'manageProgress',
  ],
  [UserRole.TRAINER]: [
    'viewDashboard',
    'viewMembers',
    'viewAttendance',
    'viewReports',
    'assignWorkout',
    'viewNutrition',
    'viewProgress',
  ],
  [UserRole.MEMBER]: [
    'viewDashboard',
    'viewMembers',
    'viewAttendance',
    'viewReports',
    'createWorkout',
    'viewNutrition',
    'viewProgress',
  ],
};

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission);
}

export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}