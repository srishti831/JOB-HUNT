import mongoose from "mongoose";
import { JOB_TYPES } from "../utils/jobQuery.js";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requirements: { type: [String], required: true },
    salary: { type: Number, required: true, min: 0 }, // LPA
    experienceLevel: { type: Number, required: true, min: 0 }, // years
    location: { type: String, required: true, trim: true },
    jobType: { type: String, required: true, enum: JOB_TYPES },
    position: { type: Number, required: true, min: 1 }, // number of openings
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// newest-first listing (home page, /jobs, /browse) and "my jobs" for recruiters
jobSchema.index({ createdAt: -1 });
jobSchema.index({ created_by: 1, createdAt: -1 });

export const Job = mongoose.model("Job", jobSchema);
