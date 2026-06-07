# Job Tracker

![CI](https://github.com/thedorCode-star/Job-Tracker-App/actions/workflows/ci.yml/badge.svg)

Full-stack job application tracker — **React frontend**, **Express REST API**, **PostgreSQL**, **JWT auth**, **24 Playwright tests**, and **CI/CD** on Render.

## Live Demo

| Service | URL |
|---------|-----|
| **API** | [https://job-tracker-api-4anc.onrender.com](https://job-tracker-api-4anc.onrender.com) |
| **Health** | [https://job-tracker-api-4anc.onrender.com/health](https://job-tracker-api-4anc.onrender.com/health) |
| **Frontend** | Deploy via Render Blueprint (`job-tracker-web`) — URL shown in Render dashboard after deploy |

> Free Render services sleep after 15 min idle. First request may take ~1 minute.

## For Recruiters

| Resource | Link |
|----------|------|
| **Test report** | [GitHub Actions](https://github.com/thedorCode-star/Job-Tracker-App/actions) → latest run → download **playwright-report** artifact |
| **Test documentation** | [docs/TESTING.md](docs/TESTING.md) |
| **Postman collection** | [postman/](postman/) — import both JSON files into Postman |
| **Live API** | Try register → login → create jobs via Postman or the React app |

## Tech Stack

**Backend:** Node.js, Express 5, PostgreSQL, JWT, bcrypt  
**Frontend:** React 19, Vite, React Router  
**Testing:** Playwright (24 API tests)  
**CI/CD:** GitHub Actions → Render

## Quick Start (Local)

### Backend

```bash
npm install
cp .env.example .env   # edit with your DB credentials
psql -U job_user -d job_tracker -f init.sql
npm run dev            # http://localhost:5000
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API (production) |
| `npm test` | Run 24 Playwright API tests |
| `npm run test:report` | Open local HTML test report |
| `cd client && npm run dev` | Start React dev server |
| `cd client && npm run build` | Build React for production |

## API Reference

### Health

| Method | Endpoint | Auth |
|--------|----------|------|
| `GET` | `/health` | No |

### Auth

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/api/auth/register` | No |
| `POST` | `/api/auth/login` | No |

### Jobs (Bearer token required)

| Method | Endpoint |
|--------|----------|
| `GET` | `/api/jobs` |
| `GET` | `/api/jobs?status=applied` |
| `GET` | `/api/jobs/:id` |
| `POST` | `/api/jobs` |
| `PUT` | `/api/jobs/:id` |
| `DELETE` | `/api/jobs/:id` |

**Valid status values:** `saved`, `applied`, `interview`, `rejected`, `offer`

See [postman/](postman/) for a ready-to-import collection with auto-saved JWT tokens.

## Example Requests (Production)

```bash
curl https://job-tracker-api-4anc.onrender.com/health

curl -X POST https://job-tracker-api-4anc.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

curl -X POST https://job-tracker-api-4anc.onrender.com/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Backend Developer","company":"Tech Co","status":"applied"}'
```

## Project Structure

```
job-tracker-backend/
├── client/                   # React frontend (Vite)
├── server.js                 # API entry point
├── init.sql                  # Database schema
├── render.yaml               # Render Blueprint (API + frontend)
├── postman/                  # Postman collection for recruiters
├── docs/                     # Testing & Neon migration guides
├── tests/                    # Playwright API tests
└── src/                      # API controllers, models, routes
```

## Testing

24 automated API tests covering auth, jobs CRUD, JWT security, and user isolation.

```bash
npm test
```

**Share with recruiters:** [docs/TESTING.md](docs/TESTING.md) — explains how to download the HTML report from GitHub Actions.

## CI/CD

```
push/PR → GitHub Actions (24 tests) → deploy to Render (main only)
```

- Workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Test reports uploaded as **playwright-report** artifact (30-day retention)
- CI badge at top of this README

### Deploy on Render

1. **New → Blueprint** → connect `thedorCode-star/Job-Tracker-App`
2. Apply `render.yaml` (creates API + React static site)
3. Set **`DATABASE_URL`** in Render → see [docs/NEON_SETUP.md](docs/NEON_SETUP.md)
4. Add **`RENDER_DEPLOY_HOOK`** to GitHub secrets for CD after CI

### Neon PostgreSQL (recommended)

Render's free Postgres expires after 30 days. Migrate to free [Neon](https://neon.tech):

→ Full guide: [docs/NEON_SETUP.md](docs/NEON_SETUP.md)

## Contact

- GitHub: [@thedorCode-star](https://github.com/thedorCode-star/)
- Email: [tshims79@gmail.com](mailto:tshims79@gmail.com)

## License

ISC
