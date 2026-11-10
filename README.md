JOB-HUNT — Job Portal
A full-stack job portal built with the MERN stack, where students can discover and apply for jobs while recruiters can manage companies, publish openings, and review applications.
<p align="left">
  <a href="https://job-hunt-q6qd.onrender.com"><strong>Live Demo ↗</strong></a>
</p>Overview
JOB-HUNT brings the student and recruiter workflows into one application.
- Students can create an account, build their profile, browse and filter job listings, save jobs, apply, and track application status.
- Recruiters can register companies, publish jobs for their own companies, view applicants, and update application decisions.
The application uses a single-service deployment on Render: Express serves both the REST API and the production React build from the same origin.
Features
Student
- Sign up and log in as a student
- Create and update a profile, including bio and skills
- Upload a profile photo and PDF resume
- Browse public job listings and view job details
- Search by keyword, including job and company information
- Filter by location, salary, job type, experience, and additional job-text criteria
- Navigate paginated job results
- Save and unsave jobs
- Apply to jobs and view application status
- Withdraw a pending application
Recruiter
- Sign up and log in as a recruiter
- Register and manage company details, including a company logo
- Create job listings for companies owned by the signed-in recruiter
- View jobs posted by the recruiter and their applicant counts
- Review applicants and their resume links
- Accept or reject applications
- Delete a job; its related applications and saved-job references are also cleaned up
The /admin/... routes in the interface are recruiter-facing management pages. The application has two account roles: student and recruiter; it does not implement a separate super-admin role.

Tech Stack
Layer	Technologies
Frontend	React 19, Vite, React Router, Redux Toolkit, Redux Persist
UI	Tailwind CSS v4, Base UI, Lucide
Backend	Node.js, Express 5
Database	MongoDB Atlas, Mongoose
Authentication	JWT stored in an HTTP-only cookie, bcrypt
File uploads	Multer, Cloudinary
API communication	Axios
Testing	Node.js built-in test runner


Engineering Highlights
- Database-side search and pagination: Job filtering, keyword search, sorting, and pagination are performed in MongoDB rather than fetching every job to the browser.
- Efficient query results: Uses .lean() for read-heavy queries, selects only required populated fields, and fetches the result page and total count in parallel.
- Indexes: Includes indexes for job creation dates, recruiter job lists, and application lookups. A unique (job, applicant) index prevents duplicate applications.
- Separate application records: Applications are stored in their own collection instead of growing an embedded array on each job.
- Duplicate-application protection: The unique database index enforces the one-application-per-student-per-job rule, including concurrent requests.
- Ownership checks: Recruiters can manage only companies and jobs associated with their own account.
- Authentication/session handling: Passwords are hashed with bcrypt; JWTs are stored in HTTP-only cookies; the frontend revalidates the session through the current-user endpoint.
- Request protection: Includes rate limiting, basic security headers, request-body size limits, ObjectId validation, and production-safe error responses.
- Upload validation: Enforces file size and file-type checks for images and PDF resumes; image uploads are processed through Cloudinary.
- Frontend loading: Uses route-level lazy loading and cancels superseded requests to avoid stale search results.
- Operational handling: Includes a health endpoint that reports database connectivity and graceful shutdown handling.
Application Structure
JOB-HUNT/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Authentication, roles, uploads, validation, rate limits
│   ├── models/            # Mongoose schemas
│   ├── routes/            # REST API routes
│   ├── tests/             # Backend unit tests
│   ├── utils/             # Database, environment, Cloudinary, query helpers
│   └── index.js           # Express application and server
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/    # Pages and reusable UI components
│       ├── hooks/
│       ├── redux/
│       └── ...
├── render.yaml            # Render Blueprint
├── package.json           # Root build, start, and test scripts
└── README.md
Run Locally
Prerequisites
- Node.js 20 or later
- npm
- A MongoDB database (for example, MongoDB Atlas)
- Cloudinary credentials for profile photos, resumes, and company logos
1. Clone the repository
git clone https://github.com/srishti831/JOB-HUNT.git
cd JOB-HUNT
2. Configure the backend
cd backend
cp .env.example .env
npm install
Fill in backend/.env:
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_long_random_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
CROSS_SITE_COOKIE=false
3. Configure and run the frontend
Open a second terminal from the repository root:
cd frontend
cp .env.example .env
npm install
npm run dev
Set frontend/.env to:
VITE_API_URL=http://localhost:8000
The local application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
4. Start the backend
In the first terminal:
cd backend
npm run dev
Keep both development servers running while using the local application.
Environment Variables
Do not commit real .env files or credentials. The repository includes .env.example templates for local setup.
Backend
Variable	Purpose
PORT	Local backend port; the host may provide its own port in production
NODE_ENV	development locally; the hosting platform sets production mode
MONGO_URI	MongoDB connection string
SECRET_KEY	Secret used to sign JWTs; use a long, random value
CLOUD_NAME	Cloudinary cloud name
API_KEY	Cloudinary API key
API_SECRET	Cloudinary API secret
FRONTEND_URL	Allowed frontend origin(s), comma-separated; used for CORS
CROSS_SITE_COOKIE	false for same-origin hosting; true only when frontend and backend are on different sites


Frontend
Variable	Purpose
VITE_API_URL	Backend base URL. Use http://localhost:8000 locally. Leave empty for the single-origin Render deployment.


Only expose non-secret configuration through frontend variables. Never put database credentials, JWT secrets, or Cloudinary API secrets in VITE_ variables.
Deployment
The live application is deployed as one Render Web Service. The Express server serves the API and the built React app from the same domain.

Live application: https://job-hunt-q6qd.onrender.com

The repository includes a render.yaml Blueprint. The root scripts are used by the deployment:
npm run build
npm start
The build script installs backend and frontend dependencies and builds the Vite frontend. The start script launches the Express server, which serves frontend/dist when the production build exists.

Configure the following values in the Render service environment:
- MONGO_URI
- SECRET_KEY (at least 32 random characters)
- CLOUD_NAME
- API_KEY
- API_SECRET
- VITE_API_URL as an empty value for this same-origin deployment
- CROSS_SITE_COOKIE=false
- FRONTEND_URL=https://job-hunt-q6qd.onrender.com if explicitly configuring the allowed frontend origin
Render supplies the runtime port and sets NODE_ENV=production for a Node web service. Do not commit production secrets to the repository.

For MongoDB Atlas, ensure the database network access rules allow connections from the deployed service. Use the narrowest network access rule practical for your deployment.
Render's free service may spin down after inactivity, so the first request after an idle period can take longer.

API Overview
All API routes are prefixed with /api/v1.
Area	Method	Endpoint	Access
Register	POST	/user/register	Public
Login	POST	/user/login	Public
Logout	GET	/user/logout	Public
Current user	GET	/user/me	Authenticated
Update profile	POST	/user/profile/update	Authenticated
List saved jobs	GET	/user/saved	Authenticated
Toggle saved job	POST	/user/saved/:id	Authenticated
Register company	POST	/company/register	Recruiter
List own companies	GET	/company/get	Recruiter
Get company	GET	/company/get/:id	Recruiter
Update company	PUT	/company/update/:id	Recruiter
List/search jobs	GET	/job/getAllJobs	Public
Get job details	GET	/job/get/:id	Public
Post a job	POST	/job/post	Recruiter
List own jobs	GET	/job/getadminjobs	Recruiter
Delete own job	DELETE	/job/:id	Recruiter
Apply to a job	GET	/application/apply/:id	Authenticated
List own applications	GET	/application/get	Authenticated
Withdraw application	DELETE	/application/:id	Authenticated
View applicants	GET	/application/:id/applicants	Recruiter
Update application status	POST	/application/status/:id/update	Recruiter
Health check	GET	/api/health	Public


Job search query parameters
GET /api/v1/job/getAllJobs supports optional query parameters:
- keyword
- location (comma-separated)
- jobType
- salaryMin, salaryMax
- expMin, expMax
- textFilter (repeatable)
- page
- limit (maximum 50)
The response includes the job results and pagination metadata: page, limit, total, and totalPages.
Tests
Run the backend tests from the repository root:
npm test
The current automated tests cover the job-query helper (including regex escaping and pagination limits) and the rate limiter. Controllers, database integration, and the frontend are not covered by the current test suite.
Known Limitations
- Keyword search uses case-insensitive regular expressions. For a larger dataset, MongoDB text search or Atlas Search would be more suitable.
- Industry, work mode, education, and department filters are keyword matches against job text rather than dedicated structured fields; results may therefore be approximate.
- Salary is represented as a single INR LPA value, and locations are free text rather than geospatial data.
- Jobs cannot currently be edited after posting; a recruiter must delete and repost. Companies do not have a delete workflow, and jobs do not have an expiry/closed state.
- The applicants list is capped at 500 entries per job and does not currently provide search, sorting, or pagination.
- Authentication uses a one-day JWT cookie without refresh tokens, server-side token revocation, email verification, or password reset.
- Rate limiting is in-memory and resets when the server restarts; it is not shared across multiple instances.
- Security headers are a basic hand-written set; a Content Security Policy is not configured.
- Uploaded resumes and images are stored at Cloudinary URLs. Anyone with access to a URL may be able to view that file.
- There is no dedicated CSRF token. Cookie SameSite settings and the CORS allow-list provide the current cross-origin protections.
- Automated test coverage is currently limited to utility-level backend tests; there are no controller, database integration, or UI tests.
- The UI is responsive, but accessibility, SEO, and server-side rendering have not been comprehensively implemented.
Future Improvements
- Job editing, job closing, and expiry workflows
- Email notifications for application status updates
- Password reset and email verification
- Refresh-token and session-revocation support
- Redis-backed rate limiting for multi-instance deployments
- Expanded integration and frontend tests
- CI workflow for linting, tests, and production builds
- Structured job fields and more advanced search
Author
Srishti Singh

Built as a full-stack portfolio project to practise designing, securing, testing, and deploying a MERN application.