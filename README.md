# JobPortal (JOB-HUNT)

MERN job portal. **Students** sign up, search / filter jobs, save them, apply and track the status.
**Recruiters** register companies, post jobs, see applicants and accept / reject them.

Stack: React 19 + Vite + Tailwind v4 + shadcn (base-ui) + Redux Toolkit · Node + Express 5 + MongoDB (Mongoose) · Cloudinary · JWT in an httpOnly cookie.

> This is a portfolio / learning project, not a commercial product. Design decisions favour
> simplicity and readability; the trade-offs are listed honestly under [Limitations](#limitations).

## Features

**Student**
- Sign up / login (with optional profile photo), edit profile, upload a PDF resume
- Search jobs by keyword (title, description, location, requirements **and company name**)
- Filter by location, salary, job type, experience (+ keyword based filters for industry, work mode, education, department)
- Paginated job lists, job details page
- **Save / bookmark jobs** and see them on the profile page
- Apply to a job, track the status (pending / accepted / rejected), **withdraw** a pending application

**Recruiter**
- Register companies (name, description, website, location, logo)
- Post jobs for their own companies, see all their jobs with the **applicant count**
- View applicants (with resume link), accept / reject
- **Delete a job** (its applications and bookmarks are cleaned up too)

## What was optimised / hardened

| Area | Change |
|---|---|
| **Query efficiency** | Filtering, keyword search and **pagination now run in MongoDB** (`GET /job/getAllJobs`) instead of downloading every job and filtering in the browser. Lists use `.lean()`, populate only the fields the UI needs, and the count + page are fetched in parallel. |
| **Indexes** | `Job(createdAt)`, `Job(created_by, createdAt)`, `Application(job, applicant)` **unique**, `Application(applicant, createdAt)`. |
| **Data model** | Removed the ever-growing `Job.applications[]` array. Applications are queried from their own collection; the job page returns only `applicantCount` and `hasApplied` (no applicant data is exposed publicly anymore). |
| **Race condition** | "Already applied" is enforced by the unique index, so double clicks / two tabs cannot create duplicate applications. |
| **Home page** | Fetches only the 6 newest jobs (was: all jobs) and works for logged-out visitors (job list / details are public; applying requires login). |
| **Frontend loading** | Route-level code splitting (`React.lazy`), each new request cancels the previous one (no stale results when filters change quickly), long-lived cache headers for hashed build assets. |
| **Uploads** | 5 MB limit, type checks (image for photos/logos, PDF for resumes), images resized + auto-compressed by Cloudinary. |
| **Security** | Rate limiting (stricter on login / register), basic security headers, body size limits, ownership checks (recruiters can only post jobs for / read their own companies), id validation (400 instead of 500), generic error messages in production, password length rules, emails stored lower-case, no email enumeration on login, env validation at start-up, proper cookie clearing on logout. |
| **Session handling** | `GET /user/me` re-validates the persisted login on start-up; a 401 logs the user out cleanly instead of leaving a "logged in" UI that fails every request. |
| **Ops** | `/api/health` also reports DB status, graceful shutdown on SIGTERM. |

## Run locally

```bash
# 1. backend
cd backend
cp .env.example .env        # then fill MONGO_URI, SECRET_KEY, CLOUD_NAME, API_KEY, API_SECRET
npm install
npm run dev                 # http://localhost:8000

# 2. frontend (new terminal)
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:8000
npm install
npm run dev                 # http://localhost:5173
```

### Tests

```bash
npm test                    # from the project root (runs the backend tests with Node's built-in test runner)
```

Covers the job search/filter query builder (including regex escaping and pagination limits) and the rate limiter.
Controllers and the UI are not covered by automated tests (see limitations).

## Deploy

### Option A – one service (recommended, easiest): Render / Railway
Express serves the API and the built React app from the same domain, so cookies "just work".

1. Push this folder to GitHub.
2. Render → New → Blueprint (uses `render.yaml`) **or** New Web Service with
   - Build command: `npm run build`
   - Start command: `npm start`
3. Environment variables: `NODE_ENV=production`, `MONGO_URI`, `SECRET_KEY` (32+ random characters), `CLOUD_NAME`, `API_KEY`, `API_SECRET`,
   `VITE_API_URL` = *(empty)*, `CROSS_SITE_COOKIE=false`.
4. MongoDB Atlas → Network Access → allow `0.0.0.0/0` (or Render's outbound IPs).

### Option B – split: frontend on Vercel/Netlify, backend on Render
- Backend env: `FRONTEND_URL=https://your-app.vercel.app`, **`CROSS_SITE_COOKIE=true`**, `NODE_ENV=production` + the DB/Cloudinary vars.
- Frontend (Vercel) root directory `frontend`, env `VITE_API_URL=https://your-backend.onrender.com`.
  `vercel.json` / `public/_redirects` already handle SPA routing.

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) before going live.

## API

| Area | Endpoints |
|---|---|
| Auth / user | `POST /api/v1/user/register` · `POST login` · `GET logout` · `GET me` · `POST profile/update` |
| Saved jobs (student) | `GET /api/v1/user/saved` · `POST /api/v1/user/saved/:jobId` (toggle) |
| Companies (recruiter) | `POST /api/v1/company/register` · `GET get` · `GET get/:id` · `PUT update/:id` (logo upload) |
| Jobs | `GET /api/v1/job/getAllJobs` (public) · `GET get/:id` (public) · `POST post` · `GET getadminjobs` · `DELETE :id` |
| Applications | `GET /api/v1/application/apply/:jobId` · `GET get` · `DELETE :id` (withdraw) · `GET :jobId/applicants` · `POST status/:id/update` |
| Health | `GET /api/health` |

`GET /job/getAllJobs` query params (all optional): `keyword`, `location` (comma separated), `jobType`, `salaryMin`, `salaryMax`,
`expMin`, `expMax`, `textFilter` (repeatable), `page`, `limit` (max 50). Response: `{ jobs, pagination: { page, limit, total, totalPages } }`.

## Limitations

Known trade-offs, deliberately left out to keep the project at a sensible size:

**Search & data**
- Keyword search uses case-insensitive regular expressions, which cannot use an index. Fine for thousands of jobs; for more, use a MongoDB text index or Atlas Search (which would also give relevance ranking).
- The *Industry*, *Work Mode*, *Education* and *Department* filters are keyword matches on the job text, because jobs have no dedicated fields for them. They can produce false positives / negatives.
- Salary is a single number in LPA (INR only) – no ranges or currencies. Locations are free text (no geo search).
- Jobs cannot be edited after posting (delete and re-post), companies cannot be deleted, and there is no job expiry / "closed" state.
- The applicants list is capped at 500 per job and has no search, sorting or pagination.

**Auth & security**
- Single JWT in an httpOnly cookie (valid 1 day): no refresh tokens, no server-side revocation, no "log out everywhere".
- No email verification, password reset or change-password flow.
- The rate limiter is in memory, so it resets on restart and is per instance. Use a shared store (e.g. Redis) when running several instances.
- Security headers are a small hand-written set (no CSP). `helmet` would be the production choice.
- Resumes and images are stored on Cloudinary under public URLs: anyone who has the link can open the file.
- No CSRF token; protection relies on `SameSite` cookies and the CORS allow-list. With `CROSS_SITE_COOKIE=true` (`SameSite=None`) this protection is weaker.

**Product**
- No email / push notifications (students must check their profile to see a status change), no chat, no recruiter analytics, no admin role.
- Application statuses are only pending / accepted / rejected.
- No i18n, no SEO / server-side rendering, only basic accessibility work, and the layout is responsive but not polished for every screen size.

**Engineering**
- No automated tests for controllers, the database layer or the UI (only unit tests for the query builder and rate limiter), and no CI pipeline.
- Responses are not compressed by Express (hosting platforms / CDNs usually do it); add the `compression` middleware if not.
- Mongoose creates indexes automatically on start-up. That is convenient here, but large production databases should create indexes through migrations.
- Free hosting tiers (Render, Atlas M0) may sleep or be slow on the first request.

**Upgrading existing data** (only if you already have a database from an earlier version)
- Emails are now stored lower-case; accounts registered with capital letters must be lower-cased or re-created.
- The unique application index cannot be built while duplicate `(job, applicant)` applications exist – remove the duplicates first.
- Phone numbers are stored as text and job `position` as a number; old values are converted when read.
- The old `Job.applications` array is ignored (it can be removed from old documents with `$unset`).

## Ideas for the future
Job editing / closing, email notifications, `helmet` + `compression`, text index or Atlas Search, refresh tokens + password reset,
Redis-backed rate limiting, integration tests with `mongodb-memory-server` + `supertest`, CI (GitHub Actions) that runs lint, tests and the build.
