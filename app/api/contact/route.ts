import {
  hasContactErrors,
  validateContact,
  type ContactValues,
} from '@/lib/contact';

// Formspree form endpoint (https://formspree.io/f/...). Server-side only.
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT ?? '';

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const DUPLICATE_WINDOW_MS = 20_000;
const RATE_LIMIT_PRUNE_THRESHOLD = 500;

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();
const recentSubmissions = new Map<string, number>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  return realIp || 'unknown';
}

function pruneRateBuckets(now: number) {
  if (rateBuckets.size < RATE_LIMIT_PRUNE_THRESHOLD) return;
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
  for (const [key, at] of recentSubmissions) {
    if (now - at > DUPLICATE_WINDOW_MS) recentSubmissions.delete(key);
  }
}

function checkRateLimit(key: string, now: number): { allowed: boolean; retryAfter: number } {
  pruneRateBuckets(now);
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function submissionKey(values: ContactValues): string {
  return `${values.email.toLowerCase()}:${hashString(
    `${values.name}|${values.message}`,
  )}`;
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
}

async function deliverInquiry(
  values: ContactValues,
  submittedAt: Date,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const subject = `New Portfolio Inquiry — ${values.name}`;

  let response: Response;
  try {
    response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        organization: values.organization,
        service: values.service,
        message: values.message,
        submitted_at: formatSubmittedAt(submittedAt),
        _replyto: values.email,
        _subject: subject,
      }),
    });
  } catch {
    return { ok: false, error: 'network_error' };
  }

  let data: { ok?: unknown; error?: unknown } | null = null;
  try {
    data = (await response.json()) as { ok?: unknown; error?: unknown } | null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      typeof data?.error === 'string' ? data.error : `formspree_${response.status}`;
    return { ok: false, error: detail };
  }

  if (data?.ok !== true) {
    return { ok: false, error: 'no_confirmation' };
  }

  // Formspree accepted and queued the message; this is not proof of delivery.
  return { ok: true, id: 'formspree' };
}

function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(body, { status, headers });
}

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'payload_too_large' }, 413);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const body =
    rawBody && typeof rawBody === 'object'
      ? (rawBody as Record<string, unknown>)
      : {};

  // Honeypot: any non-empty value means a bot filled a field humans never see.
  const honeypot = body.portfolio_referral;
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return json({ ok: true, delivery: 'skipped' });
  }

  const now = Date.now();
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip, now);
  if (!limit.allowed) {
    return json(
      { ok: false, error: 'rate_limited', retryAfter: limit.retryAfter },
      429,
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  const { values, errors } = validateContact(body);
  if (hasContactErrors(errors)) {
    return json({ ok: false, error: 'validation', errors }, 400);
  }

  const key = submissionKey(values);
  const lastSubmission = recentSubmissions.get(key);
  if (lastSubmission && now - lastSubmission < DUPLICATE_WINDOW_MS) {
    return json({ ok: true, duplicate: true, delivery: 'skipped' });
  }
  recentSubmissions.set(key, now);

  if (!FORMSPREE_ENDPOINT) {
    recentSubmissions.delete(key);
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const submittedAt = new Date(now);
  try {
    const result = await deliverInquiry(values, submittedAt);
    if (!result.ok) {
      recentSubmissions.delete(key);
      return json({ ok: false, error: 'email_failed', detail: result.error }, 502);
    }

    // The provider accepted and queued the message; this is not proof of delivery.
    return json({ ok: true, delivery: 'queued', id: result.id });
  } catch {
    recentSubmissions.delete(key);
    return json({ ok: false, error: 'email_failed' }, 502);
  }
}