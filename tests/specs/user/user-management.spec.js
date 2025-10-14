// Playwright integration tests for user management
// Copyright 2024 JasmineGraph Team

const { test, expect } = require('@playwright/test');

// Utility to generate unique user data for tests
async function generateUser(role = 'user') {
  const { nanoid } = await import('nanoid'); // <-- dynamic import
  const id = nanoid(8);
  return {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser_${id}@example.com`,
    password: 'TestUser123!',
    role,
  };
}

test.describe('User Management Integration', () => {
  test('should register a new user and verify login', async ({ request }) => {
    const user = await generateUser();
    // Register user
    const regRes = await request.post('/backend/auth/register', {
      data: user,
    });
    expect(regRes.ok()).toBeTruthy();
    // Login user
    const loginRes = await request.post('/backend/auth/login', {
      data: { email: user.email, password: user.password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    expect(loginData.accessToken).toBeTruthy();
    // Fetch user data by token
    const userDataRes = await request.get('/backend/users/token', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    });
    expect(userDataRes.ok()).toBeTruthy();
    const userData = await userDataRes.json();
    expect(userData.data.email.toLowerCase()).toBe(user.email.toLowerCase());
  });

  test('should register a new admin and verify', async ({ request }) => {
    const admin = await generateUser('admin');
    const regRes = await request.post('/backend/users/admin', {
      data: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password,
      },
    });
    expect(regRes.ok()).toBeTruthy();

    const loginRes = await request.post('/backend/auth/login', {
      data: { email: admin.email, password: admin.password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    expect(loginData.accessToken).toBeTruthy();

    const userDataRes = await request.get('/backend/users/token', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    });
    expect(userDataRes.ok()).toBeTruthy();
    const userData = await userDataRes.json();
    expect(userData.data.email.toLowerCase()).toBe(admin.email.toLowerCase());
  });

  test('should list all users and find the new user', async ({ request }) => {
    const user = await generateUser();
    await request.post('/backend/auth/register', { data: user });

    const listRes = await request.get('/backend/users');
    expect(listRes.ok()).toBeTruthy();
    const listData = await listRes.json();

    const found = listData.data.find(
      u => u.email.toLowerCase() === user.email.toLowerCase()
    );
    expect(found).toBeTruthy();
  });

  test('should not allow duplicate registration', async ({ request }) => {
    const user = await generateUser();
    await request.post('/backend/auth/register', { data: user });

    const regRes = await request.post('/backend/auth/register', { data: user });
    expect(regRes.ok()).toBeFalsy();
  });
});
