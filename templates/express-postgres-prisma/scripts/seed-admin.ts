import readline from 'node:readline';
import { PrismaClient, type UserRole } from '../src/lib/prisma-client';
import { hashPassword } from '../src/utils/password-hash';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const adminDetails: Partial<{ email: string; password: string; name: string; role: UserRole }> = {
  name: 'Admin',
  role: 'ADMIN',
};

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      console.log('Existing admin found. Removing the current admin...');
      await prisma.user.delete({
        where: { id: existingAdmin.id },
      });
      console.log('Existing admin removed.');
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(adminDetails.password!);

    await prisma.user.create({
      data: {
        name: adminDetails.name!,
        role: adminDetails.role!,
        email: adminDetails.email!,
        password: hashedPassword,
      },
    });

    console.log('Admin user created successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

async function promptForAdminDetails() {
  rl.question('Enter admin email: ', (email) => {
    adminDetails.email = email;

    rl.question('Enter admin password: ', (password) => {
      adminDetails.password = password;

      seedDatabase();
      rl.close();
    });
  });
}

promptForAdminDetails();
