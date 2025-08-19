#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting database seeding...');

try {
  // Run Prisma db push to ensure schema is up to date
  console.log('📦 Pushing database schema...');
  execSync('npx prisma db push', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  // Run the seed script
  console.log('🌿 Running seed script...');
  execSync('npx prisma db seed', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📋 Login Credentials:');
  console.log('Admin: admin1 / Dayesh@123');
  console.log('Teacher: teacher1 / Dayesh@123');
  console.log('Student: student1 / Dayesh@123');
  console.log('Parent: parent1 / Dayesh@123');

} catch (error) {
  console.error('❌ Error during seeding:', error.message);
  process.exit(1);
}
