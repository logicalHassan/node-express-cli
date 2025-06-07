/* eslint-disable no-console */
const mongoose = require('mongoose');
const readline = require('node:readline');
const env = require('../src/config/env');
const User = require('../src/models/user.model');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const adminDetails = {
  name: 'Admin',
  role: 'admin',
};

async function createOrReplaceAdmin() {
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

async function askAdminCredentials() {
  rl.question('Enter admin email: ', (email) => {
    adminDetails.email = email;

    rl.question('Enter admin password: ', (password) => {
      adminDetails.password = password;

      createOrReplaceAdmin();
      rl.close();
    });
  });
}

askAdminCredentials();
