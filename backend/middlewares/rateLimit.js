// Tiny in-memory rate limiter (per client IP). Good enough for a single-instance deployment;
// use a shared store such as Redis if the API is ever scaled to several instances.
export const rateLimit = ({ windowMs, max, message = "Too many requests, please try again later." }) => {
  const hits = new Map();

  // drop expired entries so the map cannot grow forever
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }, windowMs);
  cleanup.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || "unknown";
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ message, success: false });
    }
    next();
  };
};
