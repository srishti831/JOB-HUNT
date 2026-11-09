import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import getDataUri from "../utils/datauri.js";
import cloudinary, { imageUploadOptions, resumeUploadOptions } from "../utils/cloudinary.js";

const isProd = process.env.NODE_ENV === "production";
// If frontend and backend are on different domains (e.g. Vercel + Render) the cookie must be
// SameSite=None + Secure. If the backend serves the frontend (same origin) "lax" is fine.
const crossSite = process.env.CROSS_SITE_COOKIE === "true";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: crossSite ? "none" : "lax",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();
const normalizePhone = (phone) => String(phone ?? "").replace(/[\s-]/g, "");
const isValidPhone = (phone) => /^\+?\d{10,15}$/.test(phone);

const fail = (res, status, message) => res.status(status).json({ message, success: false });

const publicUser = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  profile: user.profile,
  savedJobs: (user.savedJobs || []).map(String),
});

export const register = async (req, res) => {
  try {
    const { fullname, password, role } = req.body;
    const email = normalizeEmail(req.body.email);
    const phoneNumber = normalizePhone(req.body.phoneNumber);

    if (!fullname?.trim() || !email || !phoneNumber || !password || !role) {
      return fail(res, 400, "Something is missing");
    }
    if (!["student", "recruiter"].includes(role)) return fail(res, 400, "Invalid role");
    if (!EMAIL_RE.test(email)) return fail(res, 400, "Please enter a valid email address.");
    if (!isValidPhone(phoneNumber)) return fail(res, 400, "Please enter a valid phone number (10-15 digits).");
    if (String(password).length < 8 || String(password).length > 72) {
      return fail(res, 400, "Password must be 8-72 characters long.");
    }
    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return fail(res, 400, "Profile photo must be an image.");
    }

    if (await User.exists({ email })) {
      return fail(res, 400, "User already exist with this email. Please login");
    }

    // profile photo is optional
    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, imageUploadOptions);
      profilePhoto = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname: fullname.trim(),
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto },
    });

    return res.status(201).json({ message: "Account created successfully.", success: true });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) return fail(res, 400, "User already exist with this email. Please login");
    return fail(res, 500, "Something went wrong while registering");
  }
};

export const login = async (req, res) => {
  try {
    const { password, role } = req.body;
    const email = normalizeEmail(req.body.email);
    if (!email || !password || !role) return fail(res, 400, "Something is missing");

    const user = await User.findOne({ email });
    // same message for "no such user" and "wrong password" so emails can't be probed
    if (!user || !(await bcrypt.compare(String(password), user.password))) {
      return fail(res, 400, "Incorrect email or password.");
    }
    if (role !== user.role) return fail(res, 400, "Account doesn't exist with current role.");

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: publicUser(user),
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

export const logout = async (req, res) => {
  // clearCookie needs the same options the cookie was set with, otherwise browsers keep it
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json({ message: "Logged out successfully.", success: true });
};

// current session -> lets the frontend refresh its (persisted) copy of the user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res
        .status(401)
        .clearCookie("token", cookieOptions)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({ user: publicUser(user), success: true });
  } catch (error) {
    console.error("getMe error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, bio, skills } = req.body;
    const file = req.file;

    if (file && file.mimetype !== "application/pdf") {
      return fail(res, 400, "Resume must be a PDF file.");
    }

    const user = await User.findById(req.id);
    if (!user) return fail(res, 400, "User not found");

    if (fullname?.trim()) user.fullname = fullname.trim();

    if (req.body.email !== undefined && req.body.email !== "") {
      const email = normalizeEmail(req.body.email);
      if (!EMAIL_RE.test(email)) return fail(res, 400, "Please enter a valid email address.");
      if (email !== user.email) {
        if (await User.exists({ email, _id: { $ne: user._id } })) {
          return fail(res, 400, "This email is already used by another account.");
        }
        user.email = email;
      }
    }

    if (req.body.phoneNumber !== undefined && req.body.phoneNumber !== "") {
      const phone = normalizePhone(req.body.phoneNumber);
      if (!isValidPhone(phone)) return fail(res, 400, "Please enter a valid phone number (10-15 digits).");
      user.phoneNumber = phone;
    }

    if (bio !== undefined) user.profile.bio = String(bio).slice(0, 300);

    // an empty string is allowed -> clears the skills
    if (skills !== undefined) {
      user.profile.skills = String(skills)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30);
    }

    if (file) {
      const fileUri = getDataUri(file);
      const baseName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, resumeUploadOptions(baseName));
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: publicUser(user),
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return fail(res, 500, "Something went wrong while updating profile");
  }
};

// ---------- saved (bookmarked) jobs ----------

export const toggleSavedJob = async (req, res) => {
  try {
    if (req.role !== "student") return fail(res, 403, "Only students can save jobs.");

    const jobId = req.params.id;
    if (!(await Job.exists({ _id: jobId }))) return fail(res, 404, "Job not found.");

    const alreadySaved = await User.exists({ _id: req.id, savedJobs: jobId });
    const update = alreadySaved ? { $pull: { savedJobs: jobId } } : { $addToSet: { savedJobs: jobId } };
    const user = await User.findByIdAndUpdate(req.id, update, { new: true }).select("savedJobs");

    return res.status(200).json({
      message: alreadySaved ? "Removed from saved jobs." : "Job saved.",
      saved: !alreadySaved,
      savedJobs: (user?.savedJobs || []).map(String),
      success: true,
    });
  } catch (error) {
    console.error("toggleSavedJob error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.id)
      .select("savedJobs")
      .populate({ path: "savedJobs", populate: { path: "company", select: "name logo" } })
      .lean();
    return res.status(200).json({ jobs: user?.savedJobs || [], success: true });
  } catch (error) {
    console.error("getSavedJobs error:", error);
    return fail(res, 500, "Something went wrong");
  }
};
