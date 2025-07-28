// createTestUser.js
// This script creates a test user in the authentication service

const AUTH_API_BASE_URL = 'http://10.232.142.14:8090/api/v1/authentication';

async function createTestUser() {
  const testUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  try {
    console.log('Creating test user...');
    
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Test user created successfully!');
      console.log('Email:', testUser.email);
      console.log('Password:', testUser.password);
      console.log('Token:', data.token);
      console.log('\nYou can now use these credentials to test the login functionality.');
    } else {
      const errorData = await response.json();
      if (errorData.message && errorData.message.includes('already exists')) {
        console.log('ℹ️ Test user already exists!');
        console.log('Email:', testUser.email);
        console.log('Password:', testUser.password);
        console.log('\nYou can use these credentials to test the login functionality.');
      } else {
        console.error('❌ Failed to create test user:', errorData);
      }
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    console.log('\nMake sure the auth-service is running on port 8090');
  }
}

// Run the script
createTestUser(); 