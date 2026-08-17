
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@1234', 10);

  const admin = await prisma.user.upsert({

    where: { email: 'admin@roxiler.com' },
    update: {},
    create: {
      name: 'Roxiler System Administrator Account',
      email: 'admin@roxiler.com',
      password: hashedPassword,
      address: 'Head Office, Roxiler Systems, India',
      role: 'ADMIN',
    },
  });

  console.log('Admin account ready:', admin.email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
