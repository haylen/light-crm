import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  const projectDreamTeam = await db.project.create({
    data: {
      name: 'Dream Team',
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
