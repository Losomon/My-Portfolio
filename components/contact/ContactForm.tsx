'use client';

import { useRef, useState, type FormEvent } from 'react';
import {
  firstContactErrorField,
  hasContactErrors,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '@/lib/contact';

const CONTACT_EMAIL = 'solomboni5@gmail.com';

const SUCCESS_TITLE = 'Inquiry received successfully!';
const SUCCESS_BODY =
  "Thank you for reaching out. I've received your message and will review your project details. I'll get back to you as soon as possible.";
const SUCCESS_CLOSING = 'Looking forward to connecting with you.';

const RATE_LIMIT_MESSAGE =
  'Too many inquiries have been submitted. Please wait a little before trying again.';
const EMAIL_SERVICE_FAILURE_MESSAGE =
  "We couldn't send your inquiry right now. Please try again shortly.";
const NETWORK_FAILURE_MESSAGE =
  'Unable to connect. Please check your internet connection and try again.';
const DUPLICATE_MESSAGE =
  'This inquiry has already been submitted. Please wait before submitting it again.';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type ErrorKind =
  | 'rate_limited'
  | 'email_failed'
  | 'network'
  | 'duplicate'
  | 'generic';

const FIELD_IDS: Record<ContactField, string> = {
  name: 'contact-name',
  email: 'contact-email',
  organization: 'contact-organization',
  service: 'contact-service',
  message: 'contact-message',
};

function fieldClass(field: ContactField, errors: ContactErrors): string {
  return errors[field]
    ? 'contact-inquiry__field contact-inquiry__field--invalid'
    : 'contact-inquiry__field';
}

function fieldA11y(field: ContactField, errors: ContactErrors) {
  return errors[field]
    ? {
        'aria-invalid': true as const,
        'aria-describedby': `${FIELD_IDS[field]}-error`,
      }
    : {};
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorKind, setErrorKind] = useState<ErrorKind>('generic');
  const [errors, setErrors] = useState<ContactErrors>({});
  const submittingRef = useRef(false);

  function focusFirstError(nextErrors: ContactErrors) {
    const field = firstContactErrorField(nextErrors);
    if (!field) return;
    const element = document.getElementById(FIELD_IDS[field]);
    element?.focus();
  }

  function resolveErrorKind(
    response: Response,
    data: { ok?: boolean; error?: string; errors?: ContactErrors; duplicate?: boolean } | null,
  ): ErrorKind {
    if (data?.error === 'rate_limited') return 'rate_limited';
    if (data?.error === 'email_failed') return 'email_failed';
    if (data?.error === 'validation') return 'generic';
    if (data?.error === 'not_configured') return 'email_failed';
    if (data?.error === 'payload_too_large' || data?.error === 'invalid_json' || data?.error === 'unsupported_media_type') {
      return 'generic';
    }
    if (!response.ok && !data) return 'generic';
    return 'generic';
  }

  function failureMessage(kind: ErrorKind): string {
    switch (kind) {
      case 'rate_limited':
        return RATE_LIMIT_MESSAGE;
      case 'email_failed':
        return EMAIL_SERVICE_FAILURE_MESSAGE;
      case 'network':
        return NETWORK_FAILURE_MESSAGE;
      case 'duplicate':
        return DUPLICATE_MESSAGE;
      default:
        return EMAIL_SERVICE_FAILURE_MESSAGE;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      organization: String(formData.get('organization') ?? ''),
      service: String(formData.get('service') ?? ''),
      message: String(formData.get('message') ?? ''),
      portfolio_referral: String(formData.get('portfolio_referral') ?? ''),
    };

    const { errors: clientErrors } = validateContact(payload);
    setErrors(clientErrors);
    setStatus('idle');
    setErrorKind('generic');

    if (hasContactErrors(clientErrors)) {
      focusFirstError(clientErrors);
      return;
    }

    submittingRef.current = true;
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: {
        ok?: boolean;
        error?: string;
        errors?: ContactErrors;
        duplicate?: boolean;
      } | null = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setErrors({});
        setErrorKind('generic');
        setStatus('success');
        form.reset();
      } else if (data?.duplicate) {
        // Preserve entered information — the inquiry was already sent.
        setErrorKind('duplicate');
        setStatus('error');
      } else if (data?.errors) {
        setErrors(data.errors);
        setErrorKind('generic');
        setStatus('error');
      } else {
        setErrorKind(resolveErrorKind(response, data));
        setStatus('error');
      }
    } catch {
      // Network failure — the request never reached the server.
      setErrorKind('network');
      setStatus('error');
    } finally {
      submittingRef.current = false;
    }
  }

  const isSubmitting = status === 'submitting';

  return (
    <section className="contact-inquiry" aria-labelledby="contact-inquiry-title">
      <div className="contact-inquiry__inner">
        <header className="contact-inquiry__header">
          <p className="contact-inquiry__eyebrow">
            <span>01</span>
            A FEW DETAILS
          </p>
          <h2 id="contact-inquiry-title">
            Start a project <span className="font-rox">together.</span>
          </h2>
          <p className="contact-inquiry__intro">
            Tell me a little about what you have in mind. I&apos;ll get back to you soon.
          </p>
        </header>

        <div className="contact-inquiry__layout">
          <form className="contact-inquiry__form" noValidate onSubmit={handleSubmit}>
            <div className={fieldClass('name', errors)}>
              <span className="contact-inquiry__number" aria-hidden="true">01</span>
              <div>
                <label htmlFor="contact-name">What&apos;s your name?</label>
                <input
                  autoComplete="name"
                  id="contact-name"
                  name="name"
                  maxLength={100}
                  placeholder="Your name"
                  required
                  {...fieldA11y('name', errors)}
                />
                {errors.name ? (
                  <p className="contact-inquiry__error" id="contact-name-error" role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={fieldClass('email', errors)}>
              <span className="contact-inquiry__number" aria-hidden="true">02</span>
              <div>
                <label htmlFor="contact-email">What&apos;s your email?</label>
                <input
                  autoComplete="email"
                  id="contact-email"
                  maxLength={254}
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  {...fieldA11y('email', errors)}
                />
                {errors.email ? (
                  <p className="contact-inquiry__error" id="contact-email-error" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={fieldClass('organization', errors)}>
              <span className="contact-inquiry__number" aria-hidden="true">03</span>
              <div>
                <label htmlFor="contact-organization">Your organization</label>
                <input
                  autoComplete="organization"
                  id="contact-organization"
                  maxLength={150}
                  name="organization"
                  placeholder="Company or brand (optional)"
                  {...fieldA11y('organization', errors)}
                />
                {errors.organization ? (
                  <p
                    className="contact-inquiry__error"
                    id="contact-organization-error"
                    role="alert"
                  >
                    {errors.organization}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={fieldClass('service', errors)}>
              <span className="contact-inquiry__number" aria-hidden="true">04</span>
              <div>
                <label htmlFor="contact-service">What are you looking for?</label>
                <select
                  defaultValue=""
                  id="contact-service"
                  name="service"
                  {...fieldA11y('service', errors)}
                >
                  <option value="">Choose a service (optional)</option>
                  <option value="Full-stack development">Full-stack development</option>
                  <option value="Backend and API development">Backend and API development</option>
                  <option value="Business systems and automation">Business systems and automation</option>
                  <option value="Database and systems management">Database and systems management</option>
                  <option value="Website development">Website development</option>
                  <option value="Other / General inquiry">Other / General inquiry</option>
                </select>
                {errors.service ? (
                  <p className="contact-inquiry__error" id="contact-service-error" role="alert">
                    {errors.service}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={fieldClass('message', errors)}>
              <span className="contact-inquiry__number" aria-hidden="true">05</span>
              <div>
                <label htmlFor="contact-message">Tell me about your project</label>
                <textarea
                  id="contact-message"
                  maxLength={5000}
                  name="message"
                  placeholder="A few details about your idea..."
                  required
                  rows={4}
                  {...fieldA11y('message', errors)}
                />
                {errors.message ? (
                  <p className="contact-inquiry__error" id="contact-message-error" role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div aria-hidden="true" className="contact-inquiry__honeypot">
              <label htmlFor="contact-referral">Leave this field empty</label>
              <input
                autoComplete="off"
                id="contact-referral"
                name="portfolio_referral"
                tabIndex={-1}
              />
            </div>

            <button
              aria-busy={isSubmitting}
              className="contact-inquiry__submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  Sending
                  <span aria-hidden="true" className="contact-inquiry__dots">
                    <i>.</i><i>.</i><i>.</i>
                  </span>
                </>
              ) : (
                <>
                  Send inquiry <span aria-hidden="true">↗</span>
                </>
              )}
            </button>
            <p className="contact-inquiry__note">
              Your details are sent securely and only used to reply.
            </p>

            <div aria-live="polite">
              {status === 'success' ? (
                <div
                  className="contact-inquiry__status contact-inquiry__status--success"
                  role="status"
                >
                  <p className="contact-inquiry__status-title">{SUCCESS_TITLE}</p>
                  <p>{SUCCESS_BODY}</p>
                  <p>{SUCCESS_CLOSING}</p>
                </div>
              ) : null}
              {status === 'error' ? (
                <p className="contact-inquiry__status contact-inquiry__status--error" role="alert">
                  {failureMessage(errorKind)}
                </p>
              ) : null}
            </div>
          </form>

          <aside className="contact-inquiry__aside" aria-label="Contact details">
            <p className="contact-inquiry__eyebrow">PREFER A DIRECT HELLO?</p>
            <p className="contact-inquiry__aside-copy">
              I&apos;m always happy to hear about good ideas.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href="tel:0794152041">0794152041</a>
            <div className="contact-inquiry__socials">
              <span>ELSEWHERE</span>
              <a
                href="https://www.linkedin.com/in/losomon22/"
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}