# Import into Postman

Shareable API documentation for recruiters and reviewers.

## Files

| File | Purpose |
|------|---------|
| `Job-Tracker-API.postman_collection.json` | All API endpoints |
| `Job-Tracker-Production.postman_environment.json` | Live API URL + variables |

## Import steps

1. Open [Postman](https://www.postman.com/downloads/) (free desktop or web app).
2. Click **Import** → drag both JSON files (or select from this folder).
3. Select environment **Job Tracker - Production** (top-right dropdown).
4. Run requests in order:
   - **Health Check**
   - **Register** or **Login** (token saves automatically)
   - **Jobs** endpoints

## Live API

```
https://job-tracker-api-4anc.onrender.com
```

## Auto-saved variables

After **Register** or **Login**, these are set automatically:

- `token` — used for all Jobs requests
- `userId`, `userEmail`
- `jobId` — set after **Create Job**

## Share with recruiters

Zip this `postman/` folder or link to the repo:

```
postman/Job-Tracker-API.postman_collection.json
postman/Job-Tracker-Production.postman_environment.json
```
