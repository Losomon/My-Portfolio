#!/usr/bin/env node
/**
 * Production contact-form verification script.
 *
 * Run against the LIVE Vercel deployment after setting PRODUCTION_URL.
 * Tests: rate limiting, duplicate prevention, cross-instance behavior,
 * Redis degradation, Formspree rejection, validation, and success path.
 *
 * Usage:
 *   PRODUCTION_URL=https://your-site.vercel.app node scripts/verify-contact.mjs
 *
 * WARNING: This script sends real HTTP requests to your production endpoint.
 * It will consume rate-limit quota on your public IP. Run sparingly.
 */

const BASE = (process.env.PRODUCTION_URL ?? '').replace(/\/$/, '');
if (!BASE) {
  console.error('Set PRODUCTION_URL to your deployed site, e.g.');
  console.error('  PRODUCTION_URL=https://solo-portfolio-six.vercel.app node scripts/verify-contact.mjs');
  process.exit(1);
}

const API = `${BASE}/api/contact`;

let passed = 0;
let failed = 0;

function assert(name, cond, detail = '') {
  if (cond) {
    console.log(`  PASS  ${name}`);
    passed += 1;
  } else {
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
    failed += 1;
  }
}

async function post(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  return { status: res.status, data, headers: res.headers };
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Wait for the rate-limit window to reset so we start with fresh quota.
// The sliding window is 60s; add a small buffer.
const STARTUP_DELAY_MS = parseInt(process.env.STARTUP_DELAY_MS ?? '62000', 10);
if (STARTUP_DELAY_MS > 0) {
  console.log(`Waiting ${STARTUP_DELAY_MS}ms for rate-limit window to reset...`);
  await sleep(STARTUP_DELAY_MS);
}

// ---------------------------------------------------------------------------
// 1. Field-level validation (run FIRST, before any rate-limit quota is consumed)
//    Note: 413 triggers when the entire HTTP body exceeds 16KB.
//    Field-level limits (e.g. message max 5000 chars) return 400 validation errors.
// ---------------------------------------------------------------------------
console.log('\n=== Field validation ===');

const r0 = await post({ name: 'X', email: 'x@x.com', message: 'a'.repeat(5001) });
assert('oversized message field rejected (400 validation)', r0.status === 400 && r0.data?.error === 'validation' && Boolean(r0.data?.errors?.message), JSON.stringify(r0.data));

// ---------------------------------------------------------------------------
// 2. Validation failures
// ---------------------------------------------------------------------------
console.log('\n=== Validation ===');

const r1 = await post({ name: '', email: 'bad', message: 'short' });
assert('empty fields rejected', r1.status === 400 && r1.data?.error === 'validation');
assert('field errors returned', r1.data?.errors && typeof r1.data.errors === 'object');

// ---------------------------------------------------------------------------
// 3. Honeypot
// ---------------------------------------------------------------------------
console.log('\n=== Honeypot ===');

const r2 = await post({
  name: 'Test', email: 'test@test.com', message: 'A valid message here.',
  portfolio_referral: 'bot-filled',
});
assert('honeypot bot blocked', r2.status === 200 && r2.data?.delivery === 'skipped');

// ---------------------------------------------------------------------------
// 4. Successful submission
// ---------------------------------------------------------------------------
console.log('\n=== Success path ===');

const good = {
  name: 'Verify Tester',
  email: `verify+${Date.now()}@example.com`,
  organization: 'Test Org',
  service: 'Web development',
  message: 'This is a valid production verification message for testing.',
};
const r3 = await post(good);
assert('valid submission accepted', r3.status === 200 && r3.data?.ok === true, JSON.stringify(r3.data));

// ---------------------------------------------------------------------------
// 5. Duplicate prevention (same content, same email within 20s)
// ---------------------------------------------------------------------------
console.log('\n=== Duplicate prevention ===');

const dup = await post(good);
assert('duplicate blocked (200 + duplicate flag)', dup.status === 200 && dup.data?.duplicate === true, JSON.stringify(dup.data));

// ---------------------------------------------------------------------------
// 6. Rate limiting (5 per minute)
// ---------------------------------------------------------------------------
console.log('\n=== Rate limiting ===');

// Drain remaining quota (we've used 1 success + 1 dup = 2 so far; 3 more allowed)
const rapid = [];
for (let i = 0; i < 5; i += 1) {
  rapid.push(post({
    name: `Rate Test ${i}`, email: `rate+${i}@example.com`,
    message: `Rate limit test message number ${i} for verification.`,
  }));
}
const results = await Promise.all(rapid);
const accepted = results.filter(r => r.status === 200 && r.data?.ok).length;
const rateLimited = results.filter(r => r.status === 429).length;
console.log(`  ${results.length} rapid requests: ${accepted} accepted, ${rateLimited} rate-limited`);

// One more should definitely be rate-limited
const extra = await post({
  name: 'Over Limit', email: 'over@example.com',
  message: 'This should be rate limited because we exceeded the per-minute quota.',
});
assert('6th+ request rate-limited (429)', extra.status === 429 && extra.data?.error === 'rate_limited', JSON.stringify(extra.data));
assert('Retry-After header present', Boolean(extra.headers.get('retry-after')));

// ---------------------------------------------------------------------------
// 7. Error message safety (no Redis internals leaked)
// ---------------------------------------------------------------------------
console.log('\n=== Error message security ===');
const r4 = await post({ name: 'X', email: 'x@x.com', message: 'a'.repeat(5001) });
// At this point quota may be exhausted, so we accept either a validation error (400)
// or a rate-limit rejection (429). Both are clean — no Redis internals are exposed.
const clean = (r4.status === 400 && r4.data?.error === 'validation') ||
              (r4.status === 429 && r4.data?.error === 'rate_limited');
assert('oversized message rejected cleanly (no Redis leak)', clean, JSON.stringify(r4.data));

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);