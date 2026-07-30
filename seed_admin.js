const { PrismaClient } = require('./node_modules/@prisma/client');
const bcrypt = require('./node_modules/bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
      balance: 99999,
    },
    create: {
      username: 'admin',
      name: 'Admin Master',
      email: 'admin@webshop.local',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 99999,
    },
  });

  console.log('ADMIN USER UPGRADED / CREATED:', admin);
}

main().catch(console.error).finally(() => prisma.$disconnect());
