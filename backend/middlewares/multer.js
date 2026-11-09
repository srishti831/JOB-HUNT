import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req, file, cb) => {
  const ok = file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
  if (ok) return cb(null, true);
  const err = new Error("Only image or PDF files are allowed.");
  err.status = 400;
  cb(err);
};

// memory storage: files go straight to Cloudinary, nothing is written to disk
export const singleUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter,
}).single("file");
