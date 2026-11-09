import express from "express";
import { registerCompany, getCompany, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isRecruiter from "../middlewares/isRecruiter.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, isRecruiter, registerCompany);
router.route("/get").get(isAuthenticated, isRecruiter, getCompany);
router.route("/get/:id").get(isAuthenticated, isRecruiter, validateObjectId(), getCompanyById);
router.route("/update/:id").put(isAuthenticated, isRecruiter, validateObjectId(), singleUpload, updateCompany);

export default router;
