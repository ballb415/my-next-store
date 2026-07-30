const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true }
  });
  console.log("USERS:", users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
