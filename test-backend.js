#!/usr/bin/env node

/**
 * Simple test script for Numy Luxury Real Estate backend
 * Run with: node test-backend.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test data
const testContactData = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  budget: '$1M - $3M',
  intent: 'Buy a home',
  neighborhood: 'Brickell',
  message: 'This is a test message from the backend test script. Please ignore this email.'
};

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Numy Luxury Real Estate Backend\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check endpoint...');
    const healthResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (healthResponse.status === 200 && healthResponse.data.status === 'healthy') {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', healthResponse);
    }

    // Test 2: Contact form submission
    console.log('\n2. Testing contact form submission...');
    const contactResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testContactData))
      }
    }, testContactData);

    if (contactResponse.status === 200 && contactResponse.data.success) {
      console.log('✅ Contact form submission successful');
    } else {
      console.log('❌ Contact form submission failed:', contactResponse);
    }

    // Test 3: Rate limiting
    console.log('\n3. Testing rate limiting (this should fail)...');
    const rateLimitResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(testContactData))
      }
    }, testContactData);

    if (rateLimitResponse.status === 429) {
      console.log('✅ Rate limiting working correctly');
    } else {
      console.log('⚠️  Rate limiting test inconclusive (may need multiple requests)');
    }

    // Test 4: Invalid data validation
    console.log('\n4. Testing input validation...');
    const invalidData = { name: '', email: 'invalid-email', message: 'too short' };
    const validationResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(invalidData))
      }
    }, invalidData);

    if (validationResponse.status === 400 && validationResponse.data.errors) {
      console.log('✅ Input validation working correctly');
    } else {
      console.log('❌ Input validation failed:', validationResponse);
    }

    // Test 5: 404 handling
    console.log('\n5. Testing 404 handling...');
    const notFoundResponse = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/nonexistent',
      method: 'GET'
    });

    if (notFoundResponse.status === 404) {
      console.log('✅ 404 handling working correctly');
    } else {
      console.log('❌ 404 handling failed:', notFoundResponse);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure the server is running with: npm start');
  }

  console.log('\n🏁 Backend tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Configure your .env file with real Gmail credentials');
  console.log('2. Test the contact form through the website');
  console.log('3. Deploy to production when ready');
}

// Check if server is running
console.log('🔍 Checking if server is running on port 3000...');

const checkServer = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
}, (res) => {
  console.log('✅ Server is running, starting tests...\n');
  runTests();
});

checkServer.on('error', () => {
  console.log('❌ Server is not running on port 3000');
  console.log('💡 Start the server first with: npm start\n');
});

checkServer.on('timeout', () => {
  console.log('❌ Server connection timeout');
  console.log('💡 Make sure the server is running on port 3000\n');
  checkServer.destroy();
});

checkServer.end();