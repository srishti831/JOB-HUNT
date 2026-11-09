import { lazy, Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import useAuthSync from "./hooks/useAuthSync";

// Route-level code splitting: each page is downloaded only when it is first visited,
// so the first load (home page) ships a much smaller JS bundle.
const Login = lazy(() => import("./components/auth/Login"));
const Signup = lazy(() => import("./components/auth/Signup"));
const Home = lazy(() => import("./components/Home"));
const Jobs = lazy(() => import("./components/Jobs"));
const Browse = lazy(() => import("./components/Browse"));
const Profile = lazy(() => import("./components/Profile"));
const JobDescription = lazy(() => import("./components/JobDescription"));
const NotFound = lazy(() => import("./components/NotFound"));
const Companies = lazy(() => import("./components/admin/Companies"));
const CompanyCreate = lazy(() => import("./components/admin/CompanyCreate"));
const CompanySetup = lazy(() => import("./components/admin/CompanySetup"));
const AdminJobs = lazy(() => import("./components/admin/AdminJobs"));
const PostJob = lazy(() => import("./components/admin/PostJob"));
const Applicants = lazy(() => import("./components/admin/Applicants"));

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/description/:id', element: <JobDescription /> },
  { path: '/browse', element: <Browse /> },
  { path: '/profile', element: <Profile /> },

  // admin (recruiter) routes
  { path: '/admin/companies', element: <ProtectedRoute><Companies /></ProtectedRoute> },
  { path: '/admin/companies/create', element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> },
  { path: '/admin/companies/:id', element: <ProtectedRoute><CompanySetup /></ProtectedRoute> },
  { path: '/admin/jobs', element: <ProtectedRoute><AdminJobs /></ProtectedRoute> },
  { path: '/admin/jobs/create', element: <ProtectedRoute><PostJob /></ProtectedRoute> },
  { path: '/admin/jobs/:id/applicants', element: <ProtectedRoute><Applicants /></ProtectedRoute> },

  { path: '*', element: <NotFound /> },
])

function App() {
  useAuthSync();
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
      <RouterProvider router={appRouter} />
    </Suspense>
  )
}

export default App
