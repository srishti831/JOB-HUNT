import express from "express";
import { postJob, getAllJobs, getAdminJobs, getJobById, deleteJob } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

// public: anyone can browse jobs (a logged-in user additionally gets `hasApplied`)
router.route("/getAllJobs").get(getAllJobs);
router.route("/get/:id").get(optionalAuth, validateObjectId(), getJobById);

// recruiter only
router.route("/post").post(isAuthenticated, isRecruiter, postJob);
router.route("/getadminjobs").get(isAuthenticated, isRecruiter, getAdminJobs);
router.route("/:id").delete(isAuthenticated, isRecruiter, validateObjectId(), deleteJob);

export default router;
