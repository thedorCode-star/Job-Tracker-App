const { test, expect } = require('@playwright/test');
const { registerUser, loginUser, uniqueEmail } = require('../helpers/auth');

test.describe('Auth API — register', () => {
  test('POST /api/auth/register creates a user and returns a token', async ({ request }) => {
    const { response, email } = await registerUser(request);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.message).toBe('User registered successfully.');
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(email);
    expect(body.user.id).toBeTruthy();
  });

  test('POST /api/auth/register rejects missing email or password', async ({ request }) => {
    const missingPassword = await request.post('/api/auth/register', {
      data: { email: uniqueEmail() },
    });
    expect(missingPassword.status()).toBe(400);
    expect((await missingPassword.json()).error).toBe('Email and password are required.');

    const missingEmail = await request.post('/api/auth/register', {
      data: { password: 'password123' },
    });
    expect(missingEmail.status()).toBe(400);
    expect((await missingEmail.json()).error).toBe('Email and password are required.');
  });

  test('POST /api/auth/register rejects passwords shorter than 8 characters', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: { email: uniqueEmail(), password: 'short' },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe('Password must be at least 8 characters long.');
  });

  test('POST /api/auth/register rejects duplicate email', async ({ request }) => {
    const email = uniqueEmail('duplicate');

    const first = await registerUser(request, { email });
    expect(first.response.status()).toBe(201);

    const second = await registerUser(request, { email });
    expect(second.response.status()).toBe(409);
    expect((await second.response.json()).error).toBe('User already exists.');
  });
});

test.describe('Auth API — login', () => {
  test('POST /api/auth/login returns a token for valid credentials', async ({ request }) => {
    const { email, password } = await registerUser(request);
    const loginResponse = await loginUser(request, { email, password });

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();
    expect(body.message).toBe('Login successful.');
    expect(body.token).toBeTruthy();
    expect(body.user.email).toBe(email);
  });

  test('POST /api/auth/login rejects missing email or password', async ({ request }) => {
    const missingPassword = await loginUser(request, { email: uniqueEmail() });
    expect(missingPassword.status()).toBe(400);
    expect((await missingPassword.json()).error).toBe('Email and password are required.');

    const missingEmail = await loginUser(request, { password: 'password123' });
    expect(missingEmail.status()).toBe(400);
    expect((await missingEmail.json()).error).toBe('Email and password are required.');
  });

  test('POST /api/auth/login rejects unknown email', async ({ request }) => {
    const response = await loginUser(request, {
      email: uniqueEmail('unknown'),
      password: 'password123',
    });

    expect(response.status()).toBe(401);
    expect((await response.json()).error).toBe('Invalid email or password.');
  });

  test('POST /api/auth/login rejects wrong password', async ({ request }) => {
    const { email } = await registerUser(request);

    const response = await loginUser(request, {
      email,
      password: 'wrong-password',
    });

    expect(response.status()).toBe(401);
    expect((await response.json()).error).toBe('Invalid email or password.');
  });
});
