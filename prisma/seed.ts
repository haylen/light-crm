import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '~/services/auth.server';

const db = new PrismaClient();

/*
 * Seed - npx prisma db seed
 * Reset - npx prisma db push --force-reset && npx prisma db seed
 */

async function seed() {
  await db.broker.create({
    data: {
      name: 'Aplha',
      managerPercentage: 2,
    },
  });

  const passwordHash = await hashPassword('twixrox');

  await db.user.create({
    data: {
      passwordHash,
      email: 'kody@gmail.com',
      roles: {
        create: {
          role: UserRole.Admin,
        },
      },
    },
  });

  await db.user.create({
    data: {
      passwordHash,
      email: 'aff-1@one.com',
      roles: {
        create: {
          role: UserRole.Affiliate,
        },
      },
    },
  });
}

seed();
