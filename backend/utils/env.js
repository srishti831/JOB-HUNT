// Fail fast on a broken configuration instead of crashing later with a confusing error.
export const validateEnv = () => {
  const missing = ["MONGO_URI", "SECRET_KEY"].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production") {
    const secret = process.env.SECRET_KEY;
    if (secret.length < 32 || secret.startsWith("change-me")) {
      console.error("SECRET_KEY is too weak for production (use 32+ random characters).");
      process.exit(1);
    }
  }

  const cloudinaryMissing = ["CLOUD_NAME", "API_KEY", "API_SECRET"].filter((k) => !process.env[k]);
  if (cloudinaryMissing.length) {
    console.warn(
      `Cloudinary is not configured (${cloudinaryMissing.join(", ")}) - uploads will fail until it is.`
    );
  }
};
