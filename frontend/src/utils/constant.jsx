// Backend base URL. Set VITE_API_URL in .env (local) or in your hosting dashboard (production).
// Leave it empty when the backend serves the frontend (same origin) -> requests go to /api/v1/...
const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export const USER_API_END_POINT = `${API_BASE}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE}/api/v1/company`;
