import express from "express";
import { postJob , getAllJobs , getAdminJobs , getJobById } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();
router.route("/post").post(isAuthenticated, postJob);
router.route("/getAllJobs").get(isAuthenticated ,getAllJobs);
router.route("/getadminjobs").get(isAuthenticated , getAdminJobs);
router.route("/get/:id").put(isAuthenticated , getJobById);


export default router;