import test from "node:test";
import assert from "node:assert/strict";
import { buildJobFilter, parsePagination, normalizeJobType, escapeRegex } from "../utils/jobQuery.js";

const matches = (cond, value) => {
  const rx = Object.values(cond)[0];
  return rx.test(value);
};

test("no params -> empty filter", () => {
  assert.deepEqual(buildJobFilter({}), {});
  assert.deepEqual(buildJobFilter(), {});
});

test("keyword searches text fields and optionally company ids", () => {
  const { $and } = buildJobFilter({ keyword: "react" }, { companyIds: ["abc"] });
  const or = $and[0].$or;
  assert.equal(or.length, 5);
  assert.ok(or[0].title.test("Senior React Developer"));
  assert.deepEqual(or[4], { company: { $in: ["abc"] } });
});

test("keyword is regex-escaped (no ReDoS / injection through special characters)", () => {
  const { $and } = buildJobFilter({ keyword: "c++ (dev)" });
  const rx = $and[0].$or[0].title;
  assert.ok(rx.test("Looking for C++ (Dev) engineer"));
  assert.equal(escapeRegex("a.b*c"), "a\\.b\\*c");
});

test("location accepts several words", () => {
  const { $and } = buildJobFilter({ location: "delhi,noida, gurgaon" });
  assert.ok($and[0].location.test("Noida Sector 62"));
  assert.ok(!$and[0].location.test("Pune"));
});

test("jobType matches spelling variants", () => {
  const { $and } = buildJobFilter({ jobType: "Full Time" });
  for (const v of ["Full Time", "full-time", "FullTime", "full_time"]) assert.ok($and[0].jobType.test(v), v);
  assert.ok(!$and[0].jobType.test("Part Time"));
});

test("salary and experience ranges are inclusive and ignore junk", () => {
  assert.deepEqual(buildJobFilter({ salaryMin: "3", salaryMax: "6" }), { $and: [{ salary: { $gte: 3, $lte: 6 } }] });
  assert.deepEqual(buildJobFilter({ salaryMin: "20" }), { $and: [{ salary: { $gte: 20 } }] });
  assert.deepEqual(buildJobFilter({ expMin: "0", expMax: "0" }), { $and: [{ experienceLevel: { $gte: 0, $lte: 0 } }] });
  assert.deepEqual(buildJobFilter({ salaryMin: "abc", expMax: "" }), {});
});

test("textFilter: any word may match, each filter is ANDed", () => {
  const { $and } = buildJobFilter({ textFilter: ["remote", "b.tech,b.e."] });
  assert.equal($and.length, 2);
  assert.ok($and[0].$or[0].title.test("Remote Backend Engineer"));
  assert.ok($and[1].$or[1].description.test("Degree: B.E. in CS"));
  // words shorter than 3 chars are ignored
  assert.deepEqual(buildJobFilter({ textFilter: "ab" }), {});
});

test("normalizeJobType", () => {
  assert.equal(normalizeJobType("full-time"), "Full Time");
  assert.equal(normalizeJobType("INTERNSHIP"), "Internship");
  assert.equal(normalizeJobType("volunteer"), null);
});

test("parsePagination clamps values", () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 12, skip: 0 });
  assert.deepEqual(parsePagination({ page: "3", limit: "10" }), { page: 3, limit: 10, skip: 20 });
  assert.equal(parsePagination({ limit: "9999" }).limit, 50);
  assert.equal(parsePagination({ page: "-4", limit: "0" }).page, 1);
  assert.equal(parsePagination({ page: "abc" }).page, 1);
});
