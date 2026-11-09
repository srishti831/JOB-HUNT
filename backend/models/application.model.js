import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One application per student per job. Enforced by the database, so two quick clicks
// (or two tabs) can never create a duplicate. Also serves "has this user applied?" lookups.
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
// "my applications" page
applicationSchema.index({ applicant: 1, createdAt: -1 });

export const Application = mongoose.model("Application", applicationSchema);
