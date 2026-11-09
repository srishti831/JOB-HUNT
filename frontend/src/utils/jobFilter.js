// Turns the FilterCard selections + search keyword into query params for GET /job/getAllJobs.
// The actual filtering happens on the server (MongoDB) - see backend/utils/jobQuery.js.

const LOCATION_SYNONYMS = {
  "delhi ncr": ["delhi", "ncr", "noida", "gurgaon", "gurugram", "ghaziabad", "faridabad"],
};

// "0-3 LPA" -> [0,3] , "20+ LPA" -> [20, Infinity]
const parseRange = (label) => {
  const plus = label.match(/(\d+)\s*\+/);
  if (plus) return [Number(plus[1]), Infinity];
  const range = label.match(/(\d+)\s*-\s*(\d+)/);
  if (range) return [Number(range[1]), Number(range[2])];
  return null;
};

export const buildJobParams = ({ filters = {}, keyword = "", page = 1, limit = 12 } = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (keyword.trim()) params.set("keyword", keyword.trim());

  Object.entries(filters).forEach(([type, value]) => {
    if (!value) return;

    if (type === "Location") {
      params.set("location", (LOCATION_SYNONYMS[value.toLowerCase()] || [value.toLowerCase()]).join(","));
    } else if (type === "Salary") {
      const range = parseRange(value);
      if (range) {
        params.set("salaryMin", String(range[0]));
        if (Number.isFinite(range[1])) params.set("salaryMax", String(range[1]));
      }
    } else if (type === "Job Type") {
      params.set("jobType", value);
    } else if (type === "Experience") {
      if (value.toLowerCase() === "fresher") {
        params.set("expMin", "0");
        params.set("expMax", "0");
      } else {
        const range = parseRange(value);
        if (range) {
          params.set("expMin", String(range[0]));
          if (Number.isFinite(range[1])) params.set("expMax", String(range[1]));
        }
      }
    } else {
      // Industry / Work Mode / Education / Department: the job model has no dedicated field for
      // these, so any word of the option is searched for in the job text (see README limitations).
      const tokens = value
        .toLowerCase()
        .split(/[&/,]/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 3);
      if (tokens.length) params.append("textFilter", tokens.join(","));
    }
  });

  return params;
};
