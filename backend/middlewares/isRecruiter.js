// Use after isAuthenticated. Only recruiters can manage companies / jobs / applicants.
const isRecruiter = (req, res, next) => {
  if (req.role !== "recruiter") {
    return res.status(403).json({
      message: "Only recruiters can perform this action",
      success: false,
    });
  }
  next();
};

export default isRecruiter;
