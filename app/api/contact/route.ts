import crypto from 'node:crypto';
import {
  hasContactErrors,
  validateContact,
  type ContactValues,
} from '@/lib/contact';
import {
  acquireDuplicateLock,
  checkRateLimit,
  logSanitizedWarning,
} from '@/lib/redis';

// Formspree form endpoint (https://formspree.io/f/...). Server-side only.
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT ?? '';

const MAX_BODY_BYTES = 16 * 1024;
const DUPLICATE_WINDOW_MS = 20_000;
const RATE_LIMIT_WINDOW_MS = 60_000;

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);
}

function getClientIp(request: Request): string {
  // Vercel sets x-real-ip on the edge/proxy layer; x-forwarded-for is
  // populated by Vercel itself and is trusted in this deployment context.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  return realIp || 'unknown';
}

function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function submissionKey(values: ContactValues): string {
  // Normalize: lowercase email, collapse whitespace in name/message.
  const normalizedEmail = values.email.toLowerCase().trim();
  const normalizedName = values.name.trim().toLowerCase();
  const normalizedMessage = values.message.trim().toLowerCase();
  const raw = `${normalizedName}|${normalizedEmail}|${normalizedMessage}|${values.service ?? ''}|${values.organization ?? ''}`;
  return `portfolio:contact:dup:${hashString(raw)}`;
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

  const ip = getClientIp(request);

  // --- Distributed rate limiting (Upstash Redis sliding window) ---
  const rateResult = await checkRateLimit(ip);
  if (!rateResult.success) {
    return json(
      {
        ok: false,
        error: 'rate_limited',
        retryAfter: rateResult.retryAfter ?? RATE_LIMIT_WINDOW_MS / 1000,
      },
      429,
      { 'Retry-After': String(rateResult.retryAfter ?? RATE_LIMIT_WINDOW_MS / 1000) },
    );
  }

  if (rateResult.degraded) {
    logSanitizedWarning(
      `rate limiting degraded (Redis unavailable) for IP-derived identifier; allowing submission`,
    );
  }

  const { values, errors } = validateContact(body);
  if (hasContactErrors(errors)) {
    return json({ ok: false, error: 'validation', errors }, 400);
  }

  const dupKey = submissionKey(values);

  // --- Distributed duplicate prevention (Redis SET NX EX) ---
  const dup = await acquireDuplicateLock(dupKey, DUPLICATE_WINDOW_MS);
  if (!dup.acquired) {
    return json({ ok: true, duplicate: true, delivery: 'skipped' });
  }

  if (dup.degraded) {
    logSanitizedWarning(
      `duplicate prevention degraded (Redis unavailable) for submission; allowing submission`,
    );
  }

  if (!FORMSPREE_ENDPOINT) {
    await dup.release();
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const submittedAt = new Date();
  try {
    const result = await deliverInquiry(values, submittedAt);
    if (!result.ok) {
      // Release the duplicate lock on definitive delivery failure so the
      // legitimate sender can retry after the 20-second window.
      await dup.release();
      return json({ ok: false, error: 'email_failed', detail: result.error }, 502);
    }

    // The provider accepted and queued the message; this is not proof of delivery.
    return json({ ok: true, delivery: 'queued', id: result.id });
  } catch {
    await dup.release();
    return json({ ok: false, error: 'email_failed' }, 502);
  }
}