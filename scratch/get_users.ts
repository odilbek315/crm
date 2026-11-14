import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      organization: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });
  console.log("USERS_LIST_START");
  console.log(JSON.stringify(users, null, 2));
  console.log("USERS_LIST_END");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
