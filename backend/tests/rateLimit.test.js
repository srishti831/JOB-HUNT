import test from "node:test";
import assert from "node:assert/strict";
import { rateLimit } from "../middlewares/rateLimit.js";

const makeRes = () => {
  const res = { headers: {}, statusCode: 200, body: null };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
};

test("allows `max` requests per window, then answers 429 with Retry-After", () => {
  const limiter = rateLimit({ windowMs: 60_000, max: 2 });
  let passed = 0;
  const next = () => { passed += 1; };

  for (let i = 0; i < 2; i++) limiter({ ip: "1.1.1.1" }, makeRes(), next);
  assert.equal(passed, 2);

  const res = makeRes();
  limiter({ ip: "1.1.1.1" }, res, next);
  assert.equal(passed, 2);
  assert.equal(res.statusCode, 429);
  assert.ok(Number(res.headers["Retry-After"]) > 0);
  assert.equal(res.body.success, false);
});

test("clients are counted separately", () => {
  const limiter = rateLimit({ windowMs: 60_000, max: 1 });
  let passed = 0;
  limiter({ ip: "a" }, makeRes(), () => passed++);
  limiter({ ip: "b" }, makeRes(), () => passed++);
  assert.equal(passed, 2);
});
