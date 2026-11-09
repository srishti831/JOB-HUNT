import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const fail = (res, status, message) => res.status(status).json({ message, success: false });

export const applyJob = async (req, res) => {
  try {
    if (req.role !== "student") return fail(res, 403, "Only students can apply for jobs.");

    const jobId = req.params.id;
    if (!(await Job.exists({ _id: jobId }))) return fail(res, 404, "Job not found");

    // the unique (job, applicant) index guarantees no duplicates, even for simultaneous requests
    await Application.create({ job: jobId, applicant: req.id });

    return res.status(201).json({ message: "Job applied successfully.", success: true });
  } catch (error) {
    if (error.code === 11000) return fail(res, 400, "You have already applied for this job");
    console.error("Apply job error:", error);
    return fail(res, 500, "Failed to apply for job");
  }
};

// jobs the logged-in student applied to
export const getAppliedJobs = async (req, res) => {
  try {
    const application = await Application.find({ applicant: req.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        select: "title location salary jobType company",
        populate: { path: "company", select: "name logo" },
      })
      .lean();

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error("getAppliedJobs error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// student withdraws an application that is still pending
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, applicant: req.id });
    if (!application) return fail(res, 404, "Application not found.");
    if (application.status !== "pending") {
      return fail(res, 400, "Only pending applications can be withdrawn.");
    }
    await application.deleteOne();
    return res.status(200).json({ message: "Application withdrawn.", success: true });
  } catch (error) {
    console.error("withdrawApplication error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// recruiter: applicants of one of their jobs (capped - there is no pagination here yet)
export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select("title created_by").lean();
    if (!job) return fail(res, 404, "Job not found.");
    if (String(job.created_by) !== String(req.id)) {
      return fail(res, 403, "You can only view applicants of your own jobs.");
    }

    const applications = await Application.find({ job: job._id })
      .sort({ createdAt: -1 })
      .limit(500)
      .populate({
        path: "applicant",
        select: "fullname email phoneNumber profile.resume profile.resumeOriginalName profile.skills profile.profilePhoto",
      })
      .lean();

    return res.status(200).json({ job: { _id: job._id, title: job.title, applications }, success: true });
  } catch (error) {
    console.error("getApplicants error:", error);
    return fail(res, 500, "Something went wrong");
  }
};

// recruiter: accept / reject
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return fail(res, 400, "Status is required");

    const normalized = String(status).toLowerCase();
    if (!["pending", "accepted", "rejected"].includes(normalized)) return fail(res, 400, "Invalid status");

    const application = await Application.findById(req.params.id).populate({ path: "job", select: "created_by" });
    if (!application) return fail(res, 404, "Application not found.");
    if (String(application.job?.created_by) !== String(req.id)) {
      return fail(res, 403, "You can only update applications of your own jobs.");
    }

    application.status = normalized;
    await application.save();

    return res.status(200).json({ message: "Status updated successfully.", success: true });
  } catch (error) {
    console.error("updateStatus error:", error);
    return fail(res, 500, "Something went wrong");
  }
};
