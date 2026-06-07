const { test, expect } = require('@playwright/test');

test.describe('Health check', () => {
  test('GET /health returns ok', async ({ request }) => {
    const response = await request.get('/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual({
      status: 'ok',
      message: 'Job Tracker API is running',
    });
  });
});
