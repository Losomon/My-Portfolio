'use client';

import { type FormEvent } from 'react';

const CONTACT_EMAIL = 'solomboni5@gmail.com';

export default function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const organization = String(formData.get('organization') ?? '').trim();
    const service = String(formData.get('service') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || 'Not provided'}`,
        `Looking for: ${service || 'Not specified'}`,
        '',
        message,
      ].join('\n'),
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

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
          <form className="contact-inquiry__form" onSubmit={handleSubmit}>
            <div className="contact-inquiry__field">
              <span className="contact-inquiry__number" aria-hidden="true">01</span>
              <div>
                <label htmlFor="contact-name">What&apos;s your name?</label>
                <input
                  autoComplete="name"
                  id="contact-name"
                  name="name"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className="contact-inquiry__field">
              <span className="contact-inquiry__number" aria-hidden="true">02</span>
              <div>
                <label htmlFor="contact-email">What&apos;s your email?</label>
                <input
                  autoComplete="email"
                  id="contact-email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="contact-inquiry__field">
              <span className="contact-inquiry__number" aria-hidden="true">03</span>
              <div>
                <label htmlFor="contact-organization">Your organization</label>
                <input
                  autoComplete="organization"
                  id="contact-organization"
                  name="organization"
                  placeholder="Company or brand (optional)"
                />
              </div>
            </div>

            <div className="contact-inquiry__field">
              <span className="contact-inquiry__number" aria-hidden="true">04</span>
              <div>
                <label htmlFor="contact-service">What are you looking for?</label>
                <select id="contact-service" name="service" defaultValue="">
                  <option value="">Choose a service (optional)</option>
                  <option value="Web design">Web design</option>
                  <option value="Web development">Web development</option>
                  <option value="Design and development">Design and development</option>
                  <option value="Something else">Something else</option>
                </select>
              </div>
            </div>

            <div className="contact-inquiry__field">
              <span className="contact-inquiry__number" aria-hidden="true">05</span>
              <div>
                <label htmlFor="contact-message">Tell me about your project</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="A few details about your idea..."
                  required
                  rows={4}
                />
              </div>
            </div>

            <button className="contact-inquiry__submit" type="submit">
              Send inquiry <span aria-hidden="true">↗</span>
            </button>
            <p className="contact-inquiry__note">
              This opens a draft in your email app so you can send it directly.
            </p>
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
