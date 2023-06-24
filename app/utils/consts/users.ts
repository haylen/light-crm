import { UserRole } from '@prisma/client';

export const AVAILABLE_ROLES = [
  UserRole.Admin,
  UserRole.Accountant,
  UserRole.Affiliate,
  UserRole.Buyer,
] as const;
