import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Only logged-in recruiters can open the admin pages.
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  if (!user || user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
