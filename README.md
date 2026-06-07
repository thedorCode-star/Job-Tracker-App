# Job Tracker Backend

REST API for tracking job applications. Users can register, log in, and manage their job listings with statuses such as saved, applied, interview, rejected, and offer.

## Live API

**Base URL:** [https://job-tracker-api-4anc.onrender.com](https://job-tracker-api-4anc.onrender.com)

| Endpoint | URL |
|----------|-----|
| Health check | [https://job-tracker-api-4anc.onrender.com/health](https://job-tracker-api-4anc.onrender.com/health) |
| Register | `POST /api/auth/register` |
| Login | `POST /api/auth/login` |
| Jobs | `GET/POST /api/jobs` (requires JWT) |

```bash
curl https://job-tracker-api-4anc.onrender.com/health
```

> **Note:** The free Render tier spins down after 15 minutes of inactivity. The first request after sleep may take ~1 minute to respond.

## Tech Stack

- **Node.js** + **Express 5**
- **PostgreSQL** with `pg`
- **JWT** authentication
- **bcrypt** for password hashing
- **Playwright** for API tests

## Prerequisites

- Node.js 18+
- PostgreSQL 16+ (or Homebrew `postgresql@18`)
- npm

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd job-tracker-backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
DB_USER=job_user
DB_HOST=localhost
DB_NAME=job_tracker
DB_PASSWORD=your_password_here
DB_PORT=5432
JWT_SECRET=your_super_secret_key_change_this_please
```

> **Note:** Never commit `.env` to git. It is already listed in `.gitignore`.

### 3. Set up PostgreSQL

Create the database user and database:

```bash
psql -d postgres
```

```sql
CREATE USER job_user WITH PASSWORD 'your_password_here';
CREATE DATABASE job_tracker OWNER job_user;
GRANT ALL PRIVILEGES ON DATABASE job_tracker TO job_user;
\q
```

Load the schema:

```bash
psql -U job_user -d job_tracker -f init.sql
```

### 4. Run the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

The API runs at `http://localhost:5000` by default.

Verify it is working:

```bash
curl http://localhost:5000/health
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon |
| `npm start` | Start server |
| `npm test` | Run Playwright API tests |
| `npm run test:ui` | Run tests in Playwright UI mode |
| `npm run test:report` | Open the HTML test report |

## API Reference

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Server health check |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Log in and receive a JWT |

**Register / Login body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success response includes:**

```json
{
  "message": "User registered successfully.",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Jobs

All job routes require a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List all jobs for the logged-in user |
| `GET` | `/api/jobs?status=applied` | Filter jobs by status |
| `GET` | `/api/jobs/:id` | Get a single job |
| `POST` | `/api/jobs` | Create a job |
| `PUT` | `/api/jobs/:id` | Update a job |
| `DELETE` | `/api/jobs/:id` | Delete a job |

**Create job body:**

```json
{
  "title": "Software Engineer",
  "company": "Acme Corp",
  "location": "Remote",
  "job_url": "https://example.com/jobs/123",
  "status": "saved",
  "notes": "Found on LinkedIn",
  "applied_date": "2026-06-01"
}
```

`title` and `company` are required. `status` defaults to `saved`.

**Valid status values:** `saved`, `applied`, `interview`, `rejected`, `offer`

## Example Requests

Replace `BASE_URL` with `http://localhost:5000` locally or `https://job-tracker-api-4anc.onrender.com` in production.

```bash
# Health check (production)
curl https://job-tracker-api-4anc.onrender.com/health

# Register
curl -X POST https://job-tracker-api-4anc.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST https://job-tracker-api-4anc.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create a job
curl -X POST https://job-tracker-api-4anc.onrender.com/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Backend Developer","company":"Tech Co","status":"applied"}'

# List jobs
curl https://job-tracker-api-4anc.onrender.com/api/jobs \
  -H "Authorization: Bearer <token>"
```

## Project Structure

```
job-tracker-backend/
├── server.js                 # App entry point
├── init.sql                  # Database schema
├── playwright.config.js      # Test configuration
├── tests/
│   ├── api/                  # API test specs
│   └── helpers/              # Reusable test helpers
└── src/
    ├── controllers/          # Route handlers
    ├── middleware/           # JWT auth middleware
    ├── models/               # Database queries
    └── routes/               # Express routes
```

## Testing

Tests use Playwright's HTTP client to exercise the API. The test runner starts the server automatically before running tests.

```bash
npm test
```

Current coverage includes:

- Health check
- Auth registration and login (success and validation errors)
- Job CRUD operations
- JWT protection and user data isolation

## CI/CD

### CI

GitHub Actions runs on every push and pull request to `main` and `qa-testing`:

1. Starts a PostgreSQL service
2. Loads `init.sql`
3. Runs all Playwright API tests (`npm test`)

Workflow file: `.github/workflows/ci.yml`

### CD — Deploy to Render (free tier)

**Why Render?** Free web hosting, free PostgreSQL, no credit card required. Good for portfolio projects.

| Free tier | Limit |
|-----------|-------|
| Web service | Spins down after 15 min idle (~1 min cold start) |
| PostgreSQL | 1 GB storage, **expires after 30 days** (upgrade or migrate data before then) |

> **Tip:** For a database that stays free longer, use [Neon](https://neon.tech) for Postgres and set `DATABASE_URL` in Render manually.

#### Step 1 — Push this code to GitHub

```bash
git add .
git commit -m "chore: add Render deployment config"
git push origin main
```

#### Step 2 — Create services on Render

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **New → Blueprint**
3. Connect repo: `thedorCode-star/Job-Tracker-App`
4. Render reads `render.yaml` and creates:
   - `job-tracker-api` (web service)
   - `job-tracker-db` (PostgreSQL)
5. Click **Apply**

Your API is live at: [https://job-tracker-api-4anc.onrender.com](https://job-tracker-api-4anc.onrender.com)

Test it:

```bash
curl https://job-tracker-api-4anc.onrender.com/health
```

#### Step 3 — Connect CD to GitHub Actions

After the first deploy:

1. In Render → **job-tracker-api** → **Settings** → **Deploy Hook**
2. Copy the deploy hook URL
3. In GitHub → repo **Settings** → **Secrets and variables** → **Actions**
4. Add secret: `RENDER_DEPLOY_HOOK` = paste the URL

Now every push to `main` runs:

```
tests pass → GitHub Actions triggers Render deploy
```

`autoDeploy` is **off** in `render.yaml` so deploys only happen after CI passes.

#### Environment variables on Render

Render sets these automatically from `render.yaml`:

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Linked Postgres database |
| `JWT_SECRET` | Auto-generated |
| `NODE_ENV` | `production` |
| `PORT` | Set by Render |

#### Manual deploy

In Render dashboard → **Manual Deploy → Deploy latest commit**

## Contact

- GitHub: [@hedorCode-star](https://github.com/thedorCode-star/)
- Email: [tshims79@gmail.com](mailto:tshims79@gmail.com)

## License

ISC
