import axios from "axios";
import { toast } from "sonner";
import store from "@/redux/store";
import { logout } from "@/redux/authSlice";

// The JWT lives in an httpOnly cookie, so every request must send credentials.
axios.defaults.withCredentials = true;

// If the session expires (cookie gone / token invalid) the persisted Redux user would otherwise
// keep the UI "logged in" while every request fails. A 401 while we think we are logged in
// therefore logs the user out locally.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "";
    const isAuthCall = /\/user\/(login|register|logout)/.test(url);
    if (error?.response?.status === 401 && !isAuthCall && store.getState().auth.user) {
      store.dispatch(logout());
      toast.error("Your session has expired. Please login again.");
    }
    return Promise.reject(error);
  }
);
