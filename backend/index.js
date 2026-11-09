import "dotenv/config"; // must stay the first import so every module below sees the env vars
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./utils/db.js";
import { validateEnv } from "./utils/env.js";
import securityHeaders from "./middlewares/securityHeaders.js";
import { rateLimit } from "./middlewares/rateLimit.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

validateEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8000;

app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Render / Railway proxies -> correct client IP for rate limiting
app.use(securityHeaders);

// small body limits: the API only receives short JSON / form fields (files go through multer)
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// FRONTEND_URL can hold several origins separated by commas
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors((req, cb) => {
    const origin = req.header("Origin");
    let allowed = !origin || allowedOrigins.includes(origin);
    // same-origin requests (backend serving the frontend) are always fine
    if (!allowed) {
      try {
        allowed = new URL(origin).host === req.get("host");
      } catch {
        allowed = false;
      }
    }
    cb(null, { origin: allowed, credentials: true });
  })
);

// health check (Render / Railway / uptime monitors) - also reports the DB connection
app.get("/api/health", (req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({ status: dbUp ? "ok" : "degraded", db: dbUp ? "up" : "down" });
});

// rate limiting: strict on credential endpoints (brute force), relaxed on the rest of the API
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many attempts, please try again in a few minutes.",
});
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);
app.use("/api/", rateLimit({ windowMs: 60 * 1000, max: 300 }));

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// unknown API route (must come before the SPA fallback so API typos get JSON, not index.html)
app.use("/api/", (req, res) => {
  res.status(404).json({ message: "Route not found", success: false });
});

// Optional: serve the built frontend from this server (single-service deployment).
// Works when `frontend/dist` exists (run `npm run build` at the project root first).
const distPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(distPath)) {
  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        // Vite fingerprints everything in /assets -> safe to cache for a year; index.html must stay fresh
        const isHashedAsset = filePath.includes(`${path.sep}assets${path.sep}`);
        res.setHeader("Cache-Control", isHashedAsset ? "public, max-age=31536000, immutable" : "no-cache");
      },
    })
  );
  app.get("/{*splat}", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found", success: false });
  });
}

// error handler (multer errors, CORS errors, bad JSON, ...)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "MulterError") {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 5 MB)." : err.message;
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON body.";
  }

  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") message = "Internal server error";
  }
  res.status(status).json({ message, success: false });
});

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });

  // let in-flight requests finish when the host restarts / redeploys the service
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
});
