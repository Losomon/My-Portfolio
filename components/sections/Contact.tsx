'use client';

import { useEffect, useRef } from 'react';
import { waapi } from 'animejs';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    if (!section || !intro) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = waapi.animate(intro, {
      opacity: [0, 1],
      translateY: ['30px', '0px'],
      duration: 900,
      ease: 'out(4)',
      autoplay: false,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      tl.cancel();
    };
  }, []);

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="content-wrap contact-shell">
        <div className="contact-intro" ref={introRef}>
          <p className="eyebrow eyebrow-light reveal-char">Get in touch</p>
          <h2 className="journey-title reveal-char">
            Let&apos;s build something
            <span>great together.</span>
          </h2>
          <p className="contact-description reveal-char">
            Open for collaborations and new projects. Whether you need a digital product, a brand
            experience, or a custom system — I&apos;d love to hear about it.
          </p>
        </div>

        <div className="contact-body">
          <div className="contact-info">
            <p className="contact-info-label">Say hello</p>
            <ul className="contact-list">
              <li className="contact-item reveal-char">
                <a href="mailto:solomboni5@gmail.com" className="contact-link">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">solomboni5@gmail.com</span>
                </a>
              </li>
              <li className="contact-item reveal-char">
                <a href="tel:0794152041" className="contact-link">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">0794 152 041</span>
                </a>
              </li>
              <li className="contact-item reveal-char">
                <a href="https://www.linkedin.com/in/losomon22/" target="_blank" rel="noreferrer" className="contact-link">
                  <span className="contact-label">LinkedIn</span>
                  <span className="contact-value">losomon22</span>
                </a>
              </li>
              <li className="contact-item reveal-char">
                <a href="https://github.com/Losomon" target="_blank" rel="noreferrer" className="contact-link">
                  <span className="contact-label">GitHub</span>
                  <span className="contact-value">Losomon</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="contact-social">
            <p className="contact-social-label">Elsewhere</p>
            <div className="social-row">
              <a href="https://www.linkedin.com/in/losomon22/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-link reveal-char">
                IN
              </a>
              <a href="https://github.com/Losomon" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-link reveal-char">
                GH
              </a>
              <a href="mailto:solomboni5@gmail.com" aria-label="Email" className="social-link reveal-char">
                ✉
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
