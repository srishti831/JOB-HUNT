import { v2 as cloudinary } from "cloudinary";

// env vars are loaded by `import "dotenv/config"` at the top of index.js
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Profile photos / company logos: capped at 512px and auto-compressed -> small, fast images.
export const imageUploadOptions = {
  folder: "jobhunt/images",
  resource_type: "image",
  transformation: [{ width: 512, height: 512, crop: "limit" }, { quality: "auto", fetch_format: "auto" }],
};

export const resumeUploadOptions = (baseName) => ({
  folder: "jobhunt/resumes",
  resource_type: "auto",
  public_id: `${Date.now()}-${baseName}`,
});

export default cloudinary;
