import User from '@/models/user.model';
import mongoose from 'mongoose';
import readline from 'readline';
import { env } from '@/config';
import { IUser } from '@/types';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const adminDetails: Partial<IUser> = {
  name: 'Admin',
  role: 'admin',
};

async function seedDatabase() {
  try {
    await mongoose.connect(env.mongoose.url);
    console.log('Database connected');

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Existing admin found. Removing the current admin...');
      await User.deleteOne({ role: 'admin' });
      console.log('Existing admin removed.');
    }

    await User.create(adminDetails);
    console.log('Admin user created successfully!');
  } catch (err) {
    console.error('Error seeding database: ', err);
  } finally {
    await mongoose.connection.close();
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
