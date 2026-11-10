# JOB-HUNT – Job Portal

A MERN stack job portal where students can find and apply for jobs, and recruiters can post jobs and manage applications.

🚀 **Live Demo:** https://job-hunt-q6qd.onrender.com

## About the Project

JOB-HUNT is a job portal made to connect students looking for jobs with recruiters who want to hire candidates.

There are two types of users in the application:

- **Students:** They can create their profile, search for jobs, save jobs, apply for jobs and track their application status.
- **Recruiters:** They can register their companies, post jobs, view applicants and accept or reject applications.

The project is built using the MERN stack and is deployed on Render.

## Features

### 👨‍🎓 Student

- Sign up and login.
- Create and update profile.
- Upload profile photo and resume (PDF).
- Search jobs using keywords.
- Filter jobs by location, salary, job type and experience.
- View job details.
- Save and remove saved jobs.
- Apply for jobs.
- Check application status (Pending, Accepted or Rejected).
- Withdraw pending applications.

### 💼 Recruiter

- Sign up and login as a recruiter.
- Register companies and upload company logos.
- Post jobs for registered companies.
- View all jobs posted by them.
- Check the number of applicants for each job.
- View applicants and their resumes.
- Accept or reject applications.
- Delete job posts.

## 🛠️ Tech Stack

| Part | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS, Base UI |
| State Management | Redux Toolkit, Redux Persist |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only Cookies, bcrypt |
| File Upload | Multer, Cloudinary |
| API Calls | Axios |
| Testing | Node.js Test Runner |

## Some Important Things I Worked On

Apart from building the main features, I also worked on improving the performance and security of the application.

- **Search and Pagination:** Job search, filters and pagination are handled on the backend using MongoDB instead of fetching all jobs on the frontend.
- **Database Indexing:** Added indexes to make frequently used database queries faster.
- **Duplicate Applications:** Added a unique index on job and applicant so that a student cannot apply for the same job multiple times, even if multiple requests happen together.
- **Separate Application Collection:** Applications are stored in a separate collection instead of keeping all applications inside the Job document.
- **Authentication:** Passwords are hashed using bcrypt and JWT is stored in an HTTP-only cookie.
- **Role-Based Access:** Students and recruiters have access to different features. Recruiters can manage only their own companies and jobs.
- **Rate Limiting:** Added rate limiting, especially for login and registration routes.
- **File Validation:** Added file size and file type checks for profile photos, company logos and resumes.
- **Frontend Performance:** Used React.lazy for loading pages when needed and cancelled previous API requests when new search requests are made.
- **Error Handling:** Added input validation and better error responses to handle invalid requests.
- **Health Check:** Added an API health route to check application and database status.

## 📁 Project Structure

```text
JOB-HUNT/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   └── index.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── redux/
│       └── ...
│
├── render.yaml
├── package.json
└── README.md
```

## ⚙️ Run the Project Locally

### Requirements

- Node.js
- npm
- MongoDB database
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/srishti831/JOB-HUNT.git
cd JOB-HUNT
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and add:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
CROSS_SITE_COOKIE=false
```

Start the backend:

```bash
npm run dev
```

Backend will run at `http://localhost:8000`.

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at `http://localhost:5173`.

Keep both frontend and backend running while using the local application.

**Note:** Do not upload your actual `.env` files or secret keys to GitHub.

## 🚀 Deployment

The project is deployed on **Render using a single web service**.

Express handles both the backend API and the built React frontend, so both run on the same domain.

**Live Link:** https://job-hunt-q6qd.onrender.com

The project uses `render.yaml` for deployment configuration.

The root package.json contains the build and start scripts used by Render:

```bash
npm run build
npm start
```

The following environment variables are configured on Render:

- MONGO_URI
- SECRET_KEY
- CLOUD_NAME
- API_KEY
- API_SECRET
- VITE_API_URL (empty for the same-origin deployment)
- CROSS_SITE_COOKIE=false

Render automatically sets production mode and provides the port for the application.

The project uses MongoDB Atlas for the database and Cloudinary for file uploads.

**Note:** Render's free service may go to sleep after some time of inactivity, so the first request can take a little longer.

## 🔗 API Routes

All API routes start with `/api/v1`.

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/user/register` |
| Login | POST | `/user/login` |
| Logout | GET | `/user/logout` |
| Get Current User | GET | `/user/me` |
| Update Profile | POST | `/user/profile/update` |
| Get Saved Jobs | GET | `/user/saved` |
| Save / Remove Job | POST | `/user/saved/:id` |
| Register Company | POST | `/company/register` |
| Get Companies | GET | `/company/get` |
| Update Company | PUT | `/company/update/:id` |
| Get All Jobs | GET | `/job/getAllJobs` |
| Get Job Details | GET | `/job/get/:id` |
| Post Job | POST | `/job/post` |
| Get Recruiter's Jobs | GET | `/job/getadminjobs` |
| Delete Job | DELETE | `/job/:id` |
| Apply for Job | GET | `/application/apply/:id` |
| Get Applications | GET | `/application/get` |
| Withdraw Application | DELETE | `/application/:id` |
| View Applicants | GET | `/application/:id/applicants` |
| Update Application Status | POST | `/application/status/:id/update` |

Health check endpoint:

`/api/health`

## 🧪 Testing

Run the tests from the project root:

```bash
npm test
```

Currently, tests cover the job search query helper, pagination limits, regex handling and rate limiter.

## Limitations

There are still some things that can be improved in the project:

- Recruiters cannot edit an existing job after posting it. They have to delete and post it again.
- There is no email verification or password reset feature.
- No email or push notifications for application status updates.
- Search can be improved further using MongoDB text search or Atlas Search.
- Rate limiting currently uses in-memory storage.
- Automated tests currently cover only some backend utilities. Controller, database integration and frontend tests are not included yet.
- SEO and accessibility can be improved further.

## Future Improvements

- Edit and close job postings.
- Email notifications for application updates.
- Forgot password and email verification.
- More automated tests.
- Improve job search and filtering.
- Add CI using GitHub Actions.

---

## Author

**Srishti Singh**

Built as a learning and portfolio project while working with the MERN stack.