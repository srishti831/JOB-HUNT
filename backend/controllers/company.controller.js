import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary, { imageUploadOptions } from "../utils/cloudinary.js";

const fail = (res, status, message) => res.status(status).json({ message, success: false });

export const registerCompany = async (req, res) => {
  try {
    const companyName = String(req.body.companyName ?? "").trim();
    if (!companyName) return fail(res, 400, "Company name is required.");

    if (await Company.exists({ name: companyName })) {
      return fail(res, 400, "You can't register same company.");
    }

    const company = await Company.create({ name: companyName, userId: req.id });

    return res.status(201).json({ message: "Company registered successfully.", company, success: true });
  } catch (error) {
    if (error.code === 11000) return fail(res, 400, "You can't register same company.");
    console.error("registerCompany error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// companies of the logged-in recruiter
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error("getCompany error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return fail(res, 404, "Company not found.");
    if (String(company.userId) !== String(req.id)) return fail(res, 403, "You can only view your own company.");

    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error("getCompanyById error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    if (file && !file.mimetype.startsWith("image/")) return fail(res, 400, "Logo must be an image.");

    const company = await Company.findById(req.params.id);
    if (!company) return fail(res, 404, "Company not found.");
    if (String(company.userId) !== String(req.id)) return fail(res, 403, "You can only edit your own company.");

    if (name?.trim()) company.name = name.trim();
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, imageUploadOptions);
      company.logo = cloudResponse.secure_url;
    }

    await company.save();

    return res.status(200).json({ message: "Company information updated.", success: true });
  } catch (error) {
    console.error("updateCompany error:", error);
    return fail(res, error.code === 11000 ? 400 : 500,
      error.code === 11000 ? "A company with this name already exists." : "Something went wrong");
  }
};
