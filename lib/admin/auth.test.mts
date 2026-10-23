import { test } from "node:test";
import assert from "node:assert/strict";
import { createSession, passwordMatches, validSession, SESSION_SECONDS, sameOrigin } from "./auth.ts";

test("admin sessions reject tampering, expiration, missing configuration and password rotation", () => {
  const previous = process.env.ADMIN_PASSWORD;
  try {
    process.env.ADMIN_PASSWORD = "a-test-password-123456";
    const now = Date.now();
    const token = createSession(now);
    assert.equal(validSession(token, now), true);
    assert.equal(validSession(token, now + SESSION_SECONDS * 1000), false);
    assert.equal(validSession(`${token}x`, now), false);
    assert.equal(validSession(`${token}.extra`, now), false);
    assert.equal(validSession(undefined), false);
    assert.equal(passwordMatches("wrong"), false);
    assert.equal(passwordMatches(process.env.ADMIN_PASSWORD), true);
    process.env.ADMIN_PASSWORD = "a-new-password-123456";
    assert.equal(validSession(token, now), false);
    delete process.env.ADMIN_PASSWORD;
    assert.equal(validSession(token, now), false);
    assert.equal(passwordMatches(""), false);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previous;
  }
});

test("mutations require an exact same-origin request", () => {
  const url = "https://iic.example/api/admin/login";
  assert.equal(sameOrigin(new Request(url, { headers: { origin: "https://iic.example" } })), true);
  assert.equal(sameOrigin(new Request(url, { headers: { origin: "https://evil.example" } })), false);
  assert.equal(sameOrigin(new Request(url)), false);
});
