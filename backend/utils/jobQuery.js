// Pure helpers that turn query-string params into a MongoDB filter + pagination values.
// Kept free of any DB code so they can be unit-tested (see tests/jobQuery.test.js).

export const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract", "Freelance"];

const MAX_LIST_ITEMS = 10;
const MAX_TOKEN_LENGTH = 40;
const TEXT_FIELDS = ["title", "description", "location", "jobType", "requirements"];

export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toArray = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

// "a, b" or ["a", "b,c"] -> ["a", "b", "c"]
const toList = (v) =>
  toArray(v)
    .flatMap((x) => String(x).split(","))
    .map((x) => x.trim().slice(0, MAX_TOKEN_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_LIST_ITEMS);

const toNumber = (v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const anyOf = (words) => new RegExp(words.map(escapeRegex).join("|"), "i");

const rangeCondition = (field, min, max) => {
  const cond = {};
  if (min !== null) cond.$gte = min;
  if (max !== null) cond.$lte = max;
  return Object.keys(cond).length ? { [field]: cond } : null;
};

// Accepts "full time", "Full-Time", "FULLTIME" ... and returns the canonical label (or null).
export const normalizeJobType = (value) => {
  const key = String(value ?? "").toLowerCase().replace(/[^a-z]/g, "");
  return JOB_TYPES.find((t) => t.toLowerCase().replace(/[^a-z]/g, "") === key) || null;
};

export const getKeyword = (q = {}) => String(q.keyword ?? "").trim().slice(0, 100);

/**
 * Supported params (all optional):
 *  keyword            free text -> title / description / location / requirements / company name
 *  location           comma separated words, any of them may match the job location
 *  jobType            "Full Time", "internship" ...
 *  salaryMin/Max      LPA, inclusive
 *  expMin/Max         years of experience, inclusive
 *  textFilter         repeatable; each value is a comma separated list of words, at least one
 *                     of them must appear somewhere in the job text (used for Industry, Work Mode...)
 * `companyIds` are the ids of companies whose name matched the keyword (resolved by the caller).
 */
export const buildJobFilter = (q = {}, { companyIds = [] } = {}) => {
  const and = [];

  const keyword = getKeyword(q);
  if (keyword) {
    const rx = new RegExp(escapeRegex(keyword), "i");
    const or = ["title", "description", "location", "requirements"].map((f) => ({ [f]: rx }));
    if (companyIds.length) or.push({ company: { $in: companyIds } });
    and.push({ $or: or });
  }

  const locations = toList(q.location);
  if (locations.length) and.push({ location: anyOf(locations) });

  const typeWords = String(q.jobType ?? "").toLowerCase().match(/[a-z0-9]+/g);
  if (typeWords?.length) {
    and.push({ jobType: new RegExp(typeWords.slice(0, 5).join("[\\s_-]*"), "i") });
  }

  const salary = rangeCondition("salary", toNumber(q.salaryMin), toNumber(q.salaryMax));
  if (salary) and.push(salary);

  const experience = rangeCondition("experienceLevel", toNumber(q.expMin), toNumber(q.expMax));
  if (experience) and.push(experience);

  toArray(q.textFilter)
    .slice(0, 8)
    .forEach((value) => {
      const words = toList(value).filter((w) => w.length >= 3);
      if (words.length) {
        const rx = anyOf(words);
        and.push({ $or: TEXT_FIELDS.map((f) => ({ [f]: rx })) });
      }
    });

  return and.length ? { $and: and } : {};
};

export const parsePagination = (q = {}, { defaultLimit = 12, maxLimit = 50 } = {}) => {
  const page = Math.min(10000, Math.max(1, parseInt(q.page, 10) || 1));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(q.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
};
