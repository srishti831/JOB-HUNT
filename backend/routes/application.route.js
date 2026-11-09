import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, withdrawApplication } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, validateObjectId(), applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, isRecruiter, validateObjectId(), getApplicants);
router.route("/status/:id/update").post(isAuthenticated, isRecruiter, validateObjectId(), updateStatus);
router.route("/:id").delete(isAuthenticated, validateObjectId(), withdrawApplication);

export default router;
