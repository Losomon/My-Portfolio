'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import DragStage from '@/components/playground/DragStage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const waitFrames = (count: number) =>
  new Promise<void>((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

const waitForImage = (image: HTMLImageElement | null) => {
  if (!image) return Promise.resolve();
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();

  return new Promise<void>((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
};

export default function PlaygroundPage() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.classList.remove('is-intro');
      hero.classList.add('is-bg-in', 'is-in');
      return undefined;
    }

    let cancelled = false;
    const background = hero.querySelector<HTMLImageElement>('.pg__bg');

    waitForImage(background)
      .then(() => background?.decode?.().catch(() => {}) ?? Promise.resolve())
      .then(() => waitFrames(2))
      .then(() => {
        if (!cancelled) hero.classList.add('is-bg-in');
      })
      .catch(() => {
        if (!cancelled) hero.classList.add('is-bg-in');
      });

    const fonts = document.fonts?.ready ?? Promise.resolve();
    fonts
      .then(() => waitFrames(2))
      .then(() => {
        if (cancelled) return;
        void hero.offsetWidth;
        hero.classList.add('is-in');
      })
      .catch(() => {
        if (!cancelled) hero.classList.add('is-in');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      const background = hero.querySelector('.pg__bg');
      const content = hero.querySelector('.pg__cmp');

      if (background) {
        gsap.fromTo(
          background,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      if (content) {
        gsap.to(content, {
          y: () => hero.offsetHeight,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, hero);

    return () => context.revert();
  }, []);

  return (
    <>
      <Navigation />
      <main className="playground-page">
        <section className="pg is-intro" data-pg ref={heroRef} aria-labelledby="playground-title">
          <Image
            className="pg__bg"
            src="/images/bg.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={1322}
            decoding="async"
            fetchPriority="high"
            data-scroll
            data-scroll-speed="-3"
            data-scroll-position="top"
          />

          <div className="pg__cmp" data-pg-comp>
            <h1 className="pg__t" id="playground-title">
              <span>
                <span className="font-rox">M</span>y <span className="font-rox">P</span>layground
              </span>
            </h1>

            <div className="pg__d">
              <span className="pg__am" aria-hidden="true">
                <Image src="/images/up-arrow.svg" width={30} height={30} alt="" />
              </span>

              <p data-pg-desc>
                <span className="pg__sl" aria-hidden="true" />
                A loose collection of experiments, unused directions, old ideas, visual studies, and things
                I made simply because I wanted to see what would happen.
              </p>
            </div>
          </div>
        </section>

        <div data-scroll-section>
          <DragStage />
        </div>

        <div data-scroll-section>
          <footer className="footer ft" data-footer>
            <div className="ft__in">
              <div className="ft__em">
                <div>
                  <a href="mailto:hello@douglus.co" data-footer-email aria-label="hello@douglus.co">
                    <span aria-hidden="true">h</span>
                    <span aria-hidden="true">e</span>
                    <span aria-hidden="true">l</span>
                    <span aria-hidden="true">l</span>
                    <span aria-hidden="true">o</span>
                    <span aria-hidden="true">@</span>
                    <span aria-hidden="true">d</span>
                    <span aria-hidden="true">o</span>
                    <span aria-hidden="true">u</span>
                    <span aria-hidden="true">g</span>
                    <span aria-hidden="true">l</span>
                    <span aria-hidden="true">u</span>
                    <span aria-hidden="true">s</span>
                    <span aria-hidden="true">.</span>
                    <span aria-hidden="true">c</span>
                    <span aria-hidden="true">o</span>
                  </a>
                </div>
              </div>

              <div className="ft__c">
                <div className="ft__tx">
                  <div>
                    <p>Have a project that needs to move forward?</p>
                  </div>

                  <div>
                    <p>
                      Let&apos;s talk. No pitch, no pressure
                      <br />
                      just a conversation about what you need.
                    </p>
                  </div>
                </div>

                <div className="ft__dn" aria-hidden="true" data-dino>
                  <div className="ft__pl ft__pl--g" data-dino-layer="ghost">
                    <Image src="/images/dino.png" alt="" width={100} height={100} />
                  </div>

                  <div className="ft__pl ft__pl--m" data-dino-layer="main">
                    <Image src="/images/dino.png" alt="" width={100} height={100} />
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <div className="playground-transition-veil" aria-hidden="true" />
      </main>
      <Footer />
    </>
  );
}