# Test Report — For Recruiters & Reviewers

This project includes **24 automated API tests** covering authentication, job CRUD, JWT security, and user data isolation.

## Quick summary

| Area | Coverage |
|------|----------|
| Health check | API availability |
| Auth | Register, login, validation errors |
| Jobs | Create, read, update, delete, filter by status |
| Security | JWT required, invalid token rejected, users isolated |

## View the latest test report

1. Open the GitHub Actions tab:  
   [github.com/thedorCode-star/Job-Tracker-App/actions](https://github.com/thedorCode-star/Job-Tracker-App/actions)

2. Click the latest **CI** workflow run (green check = all tests passed).

3. Scroll to **Artifacts** at the bottom and download **`playwright-report`**.

4. Unzip and open **`index.html`** in your browser for the full interactive report.

## CI badge

The README displays a live CI status badge that reflects the latest test run on `main`.

## Run tests locally

```bash
npm install
npm test
npm run test:report   # open HTML report locally
```

## Tech

- **Playwright Test** — HTTP API testing (no browser required)
- **GitHub Actions** — runs on every push and pull request
- **JUnit + HTML reports** — uploaded as downloadable artifacts
