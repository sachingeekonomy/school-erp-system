#!/usr/bin/env node

const https = require('https');

const url = 'https://school-erp-system-brown.vercel.app/api/setup-database';

const postData = JSON.stringify({
  force: true
});

const options = {
  hostname: 'school-erp-system-brown.vercel.app',
  port: 443,
  path: '/api/setup-database',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🌱 Force seeding database...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('✅ Response:', result);
      
      if (result.success) {
        console.log('🎉 Database seeded successfully!');
        console.log('');
        console.log('📋 Login Credentials:');
        console.log('Admin: admin1 / Dayesh@123');
        console.log('Teacher: teacher1 / Dayesh@123');
        console.log('Student: student1 / Dayesh@123');
        console.log('Parent: parent1 / Dayesh@123');
      } else {
        console.log('❌ Error:', result.message);
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();
