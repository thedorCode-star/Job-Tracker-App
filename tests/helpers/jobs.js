function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function createJob(request, token, data = {}) {
  const response = await request.post('/api/jobs', {
    headers: authHeaders(token),
    data: {
      title: 'Software Engineer',
      company: 'Acme Corp',
      location: 'Remote',
      status: 'saved',
      ...data,
    },
  });

  const body = await response.json();
  return { response, body, job: body.job };
}

module.exports = {
  authHeaders,
  createJob,
};
