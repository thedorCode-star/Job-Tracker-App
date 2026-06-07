const { test, expect } = require('@playwright/test');
const { getAuthToken } = require('../helpers/auth');
const { authHeaders, createJob } = require('../helpers/jobs');

test.describe('Jobs API — authentication', () => {
  test('GET /api/jobs rejects requests without a token', async ({ request }) => {
    const response = await request.get('/api/jobs');

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('Access denied. No token provided.');
  });

  test('GET /api/jobs rejects requests with an invalid token', async ({ request }) => {
    const response = await request.get('/api/jobs', {
      headers: authHeaders('not-a-valid-token'),
    });

    expect(response.status()).toBe(403);

    const body = await response.json();
    expect(body.error).toBe('Invalid token.');
  });
});

test.describe('Jobs API — CRUD', () => {
  test('POST /api/jobs creates a job with required fields', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const { response, body, job } = await createJob(request, token, {
      title: 'Backend Developer',
      company: 'Tech Co',
      location: 'London',
      status: 'applied',
      notes: 'Referral from a friend',
    });

    expect(response.status()).toBe(201);
    expect(body.message).toBe('Job created successfully.');
    expect(job.title).toBe('Backend Developer');
    expect(job.company).toBe('Tech Co');
    expect(job.location).toBe('London');
    expect(job.status).toBe('applied');
    expect(job.notes).toBe('Referral from a friend');
  });

  test('POST /api/jobs defaults status to saved when omitted', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const { response, job } = await createJob(request, token, {
      title: 'QA Engineer',
      company: 'Quality Inc',
      status: undefined,
    });

    expect(response.status()).toBe(201);
    expect(job.status).toBe('saved');
  });

  test('POST /api/jobs rejects missing title or company', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const missingTitle = await request.post('/api/jobs', {
      headers: authHeaders(token),
      data: { company: 'Acme Corp' },
    });
    expect(missingTitle.status()).toBe(400);
    expect((await missingTitle.json()).error).toBe('Title and company are required.');

    const missingCompany = await request.post('/api/jobs', {
      headers: authHeaders(token),
      data: { title: 'Engineer' },
    });
    expect(missingCompany.status()).toBe(400);
    expect((await missingCompany.json()).error).toBe('Title and company are required.');
  });

  test('GET /api/jobs returns only the authenticated user jobs', async ({ request }) => {
    const userA = await getAuthToken(request);
    const userB = await getAuthToken(request);

    await createJob(request, userA.token, { title: 'User A Job', company: 'A Corp' });
    await createJob(request, userB.token, { title: 'User B Job', company: 'B Corp' });

    const response = await request.get('/api/jobs', {
      headers: authHeaders(userA.token),
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.jobs.length).toBeGreaterThanOrEqual(1);
    expect(body.jobs.every((job) => job.title !== 'User B Job')).toBeTruthy();
    expect(body.jobs.some((job) => job.title === 'User A Job')).toBeTruthy();
  });

  test('GET /api/jobs?status= filters jobs by status', async ({ request }) => {
    const { token } = await getAuthToken(request);

    await createJob(request, token, { title: 'Saved Job', company: 'Co', status: 'saved' });
    await createJob(request, token, { title: 'Applied Job', company: 'Co', status: 'applied' });

    const response = await request.get('/api/jobs?status=applied', {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.jobs.some((job) => job.title === 'Applied Job')).toBeTruthy();
    expect(body.jobs.every((job) => job.status === 'applied')).toBeTruthy();
  });

  test('GET /api/jobs/:id returns a single job', async ({ request }) => {
    const { token } = await getAuthToken(request);
    const { job } = await createJob(request, token, { title: 'Single Job', company: 'Solo Inc' });

    const response = await request.get(`/api/jobs/${job.id}`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.job.id).toBe(job.id);
    expect(body.job.title).toBe('Single Job');
  });

  test('GET /api/jobs/:id returns 400 for invalid id', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const response = await request.get('/api/jobs/not-a-number', {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe('Invalid job ID.');
  });

  test('GET /api/jobs/:id returns 404 when job does not exist', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const response = await request.get('/api/jobs/999999', {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(404);
    expect((await response.json()).error).toBe('Job not found.');
  });

  test('GET /api/jobs/:id returns 404 when job belongs to another user', async ({ request }) => {
    const userA = await getAuthToken(request);
    const userB = await getAuthToken(request);
    const { job } = await createJob(request, userA.token, { title: 'Private Job', company: 'Secret Co' });

    const response = await request.get(`/api/jobs/${job.id}`, {
      headers: authHeaders(userB.token),
    });

    expect(response.status()).toBe(404);
    expect((await response.json()).error).toBe('Job not found.');
  });

  test('PUT /api/jobs/:id updates a job', async ({ request }) => {
    const { token } = await getAuthToken(request);
    const { job } = await createJob(request, token, { title: 'Old Title', company: 'Old Co', status: 'saved' });

    const response = await request.put(`/api/jobs/${job.id}`, {
      headers: authHeaders(token),
      data: { title: 'New Title', status: 'interview' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe('Job updated successfully.');
    expect(body.job.title).toBe('New Title');
    expect(body.job.status).toBe('interview');
    expect(body.job.company).toBe('Old Co');
  });

  test('PUT /api/jobs/:id returns 400 for invalid id', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const response = await request.put('/api/jobs/bad-id', {
      headers: authHeaders(token),
      data: { title: 'Updated' },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe('Invalid job ID.');
  });

  test('DELETE /api/jobs/:id removes a job', async ({ request }) => {
    const { token } = await getAuthToken(request);
    const { job } = await createJob(request, token, { title: 'To Delete', company: 'Temp Co' });

    const deleteResponse = await request.delete(`/api/jobs/${job.id}`, {
      headers: authHeaders(token),
    });

    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).message).toBe('Job deleted successfully.');

    const getResponse = await request.get(`/api/jobs/${job.id}`, {
      headers: authHeaders(token),
    });
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /api/jobs/:id returns 400 for invalid id', async ({ request }) => {
    const { token } = await getAuthToken(request);

    const response = await request.delete('/api/jobs/invalid', {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toBe('Invalid job ID.');
  });
});
