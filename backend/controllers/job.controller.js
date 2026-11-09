import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { buildJobFilter, escapeRegex, getKeyword, normalizeJobType, parsePagination } from "../utils/jobQuery.js";

const fail = (res, status, message) => res.status(status).json({ message, success: false });
const OBJECT_ID = /^[a-f\d]{24}$/i;
const str = (v) => String(v ?? "").trim();

// recruiter posts a job
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

    if (
      !str(title) ||
      !str(description) ||
      !str(requirements) ||
      salary === undefined || salary === "" ||
      !str(location) ||
      !jobType ||
      experience === undefined || experience === "" ||
      position === undefined || position === "" ||
      !companyId
    ) {
      return fail(res, 400, "Something is missing.");
    }

    const canonicalType = normalizeJobType(jobType);
    if (!canonicalType) return fail(res, 400, "Invalid job type.");
    if (!OBJECT_ID.test(String(companyId))) return fail(res, 400, "Invalid company.");

    const salaryNum = Number(salary);
    const experienceNum = Number(experience);
    const positionNum = Number(position);
    if (!(salaryNum >= 0) || !(experienceNum >= 0) || !(positionNum >= 1)) {
      return fail(res, 400, "Salary, experience and positions must be valid positive numbers.");
    }

    // a recruiter may only post jobs for a company they registered
    if (!(await Company.exists({ _id: companyId, userId: req.id }))) {
      return fail(res, 403, "You can only post jobs for your own companies.");
    }

    const job = await Job.create({
      title,
      description,
      requirements: String(requirements)
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      salary: salaryNum,
      location,
      jobType: canonicalType,
      experienceLevel: experienceNum,
      position: positionNum,
      company: companyId,
      created_by: req.id,
    });

    return res.status(201).json({ message: "New job created successfully.", job, success: true });
  } catch (error) {
    console.error("postJob error:", error);
    return fail(res, error.name === "ValidationError" ? 400 : 500,
      error.name === "ValidationError" ? error.message : "Something went wrong");
  }
};

// public, paginated, filtered on the server (see utils/jobQuery.js for the supported params)
export const getAllJobs = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    // a keyword should also match the company name
    const keyword = getKeyword(req.query);
    const companyIds = keyword
      ? (await Company.find({ name: new RegExp(escapeRegex(keyword), "i") }).select("_id").limit(50).lean()).map((c) => c._id)
      : [];

    const filter = buildJobFilter(req.query, { companyIds });

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "company", select: "name logo" })
        .lean(),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      jobs,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      success: true,
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// public single job. Only counts are returned for applications (no applicant data).
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({ path: "company", select: "name logo location website" }).lean();
    if (!job) return fail(res, 404, "Job not found.");

    const [applicantCount, applied] = await Promise.all([
      Application.countDocuments({ job: jobId }),
      req.id ? Application.exists({ job: jobId, applicant: req.id }) : null,
    ]);

    return res.status(200).json({ job: { ...job, applicantCount, hasApplied: !!applied }, success: true });
  } catch (error) {
    console.error("getJobById error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// jobs created by the logged-in recruiter, with applicant counts
export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ created_by: req.id })
      .sort({ createdAt: -1 })
      .populate({ path: "company", select: "name logo" })
      .lean();

    const counts = await Application.aggregate([
      { $match: { job: { $in: jobs.map((j) => j._id) } } },
      { $group: { _id: "$job", count: { $sum: 1 } } },
    ]);
    const countByJob = new Map(counts.map((c) => [String(c._id), c.count]));

    return res.status(200).json({
      jobs: jobs.map((j) => ({ ...j, applicantCount: countByJob.get(String(j._id)) || 0 })),
      success: true,
    });
  } catch (error) {
    console.error("getAdminJobs error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// recruiter deletes one of their jobs (and everything that points to it)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select("created_by");
    if (!job) return fail(res, 404, "Job not found.");
    if (String(job.created_by) !== String(req.id)) return fail(res, 403, "You can only delete your own jobs.");

    await Promise.all([
      Application.deleteMany({ job: job._id }),
      User.updateMany({ savedJobs: job._id }, { $pull: { savedJobs: job._id } }),
      job.deleteOne(),
    ]);

    return res.status(200).json({ message: "Job deleted.", success: true });
  } catch (error) {
    console.error("deleteJob error:", error);
    return fail(res, 500, "Something went wrong");
  }
};
