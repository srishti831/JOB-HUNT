import express from "express";
import { register, login, updateProfile, logout, getMe, toggleSavedJob, getSavedJobs } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMe);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/saved").get(isAuthenticated, getSavedJobs);
router.route("/saved/:id").post(isAuthenticated, validateObjectId(), toggleSavedJob);

export default router;
