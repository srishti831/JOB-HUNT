import jwt from "jsonwebtoken";

// Like isAuthenticated, but never blocks: guests simply get no req.id.
// Used on public pages that show a bit more to a logged-in user (e.g. "already applied").
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.id = decoded.userId;
      req.role = decoded.role;
    } catch {
      // invalid / expired token -> treat as guest
    }
  }
  next();
};

export default optionalAuth;
