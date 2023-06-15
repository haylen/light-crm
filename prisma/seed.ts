import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/*
 * Seed - npx prisma db seed
 * Reset - npx prisma db push --force-reset && npx prisma db seed
 */

async function seed() {
  const projectDreamTeam = await db.project.create({
    data: {
      name: 'Dream Team',
    },
  });

  const brokerAplha = await db.broker.create({
    data: {
      name: 'Aplha',
      managerPercentage: 2,
    },
  });

  const kody = await db.user.create({
    data: {
      email: 'kody@gmail.com',
      // this is a hashed version of "twixrox"
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
      projectId: projectDreamTeam.id,
    },
  });
}

seed();
