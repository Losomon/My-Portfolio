import {
  hasContactErrors,
  validateContact,
  type ContactValues,
} from '@/lib/contact';

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'solomboni5@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
}

function buildEmail(values: ContactValues, submittedAt: Date) {
  const submittedAtLabel = formatSubmittedAt(submittedAt);
  const organization = values.organization || 'Not provided';
  const service = values.service || 'Not specified';

  const text = [
    'New portfolio inquiry',
    '',
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Organization: ${organization}`,
    `Looking for: ${service}`,
    `Submitted: ${submittedAtLabel}`,
    '',
    'Project description:',
    values.message,
  ].join('\n');

  const rows: Array<[string, string]> = [
    ['Name', values.name],
    ['Email', values.email],
    ['Organization', organization],
    ['Looking for', service],
    ['Submitted', submittedAtLabel],
  ];

  const html = [
    '<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#1e1e1e">',
    '<h2 style="font-size:18px;margin:0 0 16px">New portfolio inquiry</h2>',
    '<table style="border-collapse:collapse;font-size:14px">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${escapeHtml(
          label,
        )}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    ),
    '</table>',
    '<h3 style="font-size:14px;margin:20px 0 8px">Project description</h3>',
    `<p style="margin:0;font-size:14px;white-space:pre-wrap">${escapeHtml(
      values.message,
    )}</p>`,
    '</div>',
  ].join('');

  return { text, html, submittedAtLabel };
}

async function sendInquiryEmail(
  values: ContactValues,
  submittedAt: Date,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const subject = `New Portfolio Inquiry — ${values.name}`;
  const { text, html } = buildEmail(values, submittedAt);

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: values.email,
        subject,
        text,
        html,
      }),
    });
  } catch {
    return { ok: false, error: 'network_error' };
  }

  let data: { id?: unknown; message?: unknown } | null = null;
  try {
    data = (await response.json()) as { id?: unknown; message?: unknown } | null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      typeof data?.message === 'string' ? data.message : `resend_${response.status}`;
    return { ok: false, error: detail };
  }

  const id = typeof data?.id === 'string' ? data.id : '';
  if (!id) {
    return { ok: false, error: 'no_message_id' };
  }

  return { ok: true, id };
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

  if (!RESEND_API_KEY) {
    recentSubmissions.delete(key);
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const submittedAt = new Date(now);
  try {
    const result = await sendInquiryEmail(values, submittedAt);
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