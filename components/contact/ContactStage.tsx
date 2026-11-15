'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import LocalTime from '@/components/contact/LocalTime';
import { waitFrames, waitForImage } from '@/lib/ready';

const EMAIL = 'solomboni5@gmail.com';
const PHONE = '0794152041';
const LINKEDIN = 'https://www.linkedin.com/in/losomon22/';

type ContactLinkProps = {
  href: string;
  label: string;
  external?: boolean;
};

function ContactLink({ href, label, external = false }: ContactLinkProps) {
  return (
    <a
      className="ch__lk"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span>
        <span>
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
      </span>
    </a>
  );
}

export default function ContactStage() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.classList.remove('is-bg-wait');
      stage.classList.add('is-bg-in');
      return undefined;
    }

    let cancelled = false;
    const background = stage.querySelector<HTMLImageElement>('.ch__bg');

    waitForImage(background)
      .then(() => background?.decode?.().catch(() => {}) ?? Promise.resolve())
      .then(() => waitFrames(2))
      .then(() => {
        if (!cancelled) stage.classList.add('is-bg-in');
      })
      .catch(() => {
        if (!cancelled) stage.classList.add('is-bg-in');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="ch is-bg-wait" ref={stageRef} aria-labelledby="contact-title">
      <Image
        className="ch__bg"
        src="/images/bg_.webp"
        alt=""
        aria-hidden="true"
        width={2048}
        height={1322}
        loading="eager"
        fetchPriority="high"
      />

      <div className="ch__in">
        <div className="ch__hd">
          <h1 className="ch__t" id="contact-title">
            <span>
              <span>Let&apos;s create work</span>
            </span>

            <span>
              <span>
                that <span className="font-rox">matters</span>
              </span>
            </span>
          </h1>

          <div className="ch__q">
            <div>
              <p>Have an idea?</p>
            </div>

            <div>
              <p>Let&apos;s talk about it.</p>
            </div>
          </div>
        </div>

        <div className="ch__ct">
          <div className="ch__r">
            <span>Email</span>
            <ContactLink href={`mailto:${EMAIL}`} label={EMAIL} />
          </div>

          <div className="ch__r">
            <span>Phone</span>
            <ContactLink href={`tel:${PHONE}`} label={PHONE} />
          </div>

          <div className="ch__r">
            <span>Social</span>

            <div className="ch__so">
              <ContactLink href={LINKEDIN} label="LinkedIn" external />
            </div>
          </div>

          <div className="ch__r">
            <span>Local time</span>
            <LocalTime />
          </div>
        </div>
      </div>
    </section>
  );
}