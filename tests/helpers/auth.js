/**
 * Reusable auth helpers for API tests.
 * As the project grows, add more helpers here (createJob, etc.).
 */

const { expect } = require('@playwright/test');

function uniqueEmail(prefix = 'test') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

async function registerUser(request, { email, password = 'password123' } = {}) {
  const uniqueEmailValue = email || uniqueEmail();

  const response = await request.post('/api/auth/register', {
    data: { email: uniqueEmailValue, password },
  });

  return { response, email: uniqueEmailValue, password };
}

async function loginUser(request, { email, password }) {
  return request.post('/api/auth/login', {
    data: { email, password },
  });
}

async function getAuthToken(request, overrides = {}) {
  const { response, email, password } = await registerUser(request, overrides);

  expect(response.status()).toBe(201);

  const body = await response.json();
  return {
    token: body.token,
    user: body.user,
    email,
    password,
  };
}

module.exports = {
  uniqueEmail,
  registerUser,
  loginUser,
  getAuthToken,
};
