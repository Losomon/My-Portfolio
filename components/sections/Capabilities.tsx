'use client';

import { useEffect, useRef } from 'react';
import { createTimeline, waapi } from 'animejs';

const capabilities = [
  {
    index: '01',
    title: 'Frontend',
    description: 'Crafting interfaces that feel intuitive and precise.',
  },
  {
    index: '02',
    title: 'Backend',
    description: 'Designing systems that scale with real business needs.',
  },
  {
    index: '03',
    title: 'Data',
    description: 'Turning complexity into clear, informed decisions.',
  },
  {
    index: '04',
    title: 'Creative Tech',
    description: 'Using technology as a creative medium for expression.',
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    const link = linkRef.current;
    const cards = cardRefs.current.filter((el): el is HTMLElement => Boolean(el));
    if (!section || !intro || !link || cards.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const introAnim = waapi.animate(intro, {
      opacity: [0, 1],
      translateY: ['24px', '0px'],
      duration: 850,
      ease: 'out(3)',
      autoplay: false,
    });

    const linkAnim = waapi.animate(link, {
      opacity: [0, 1],
      translateX: ['-14px', '0px'],
      duration: 600,
      ease: 'out(3)',
      autoplay: false,
    });

    const tl = createTimeline({ autoplay: false }).sync(introAnim, 0).sync(linkAnim, 240);

    cards.forEach((card, index) => {
      const marker = card.querySelector<HTMLElement>('.capability-marker');
      const indexEl = card.querySelector<HTMLElement>('.capability-index');
      const line = card.querySelector<HTMLElement>('.capability-line');
      const title = card.querySelector<HTMLElement>('.capability-title');
      const desc = card.querySelector<HTMLElement>('.capability-desc');
      const base = 220 + index * 170;

      const cardAnim = waapi.animate(card, {
        opacity: [0, 1],
        translateY: ['28px', '0px'],
        duration: 700,
        ease: 'out(4)',
        autoplay: false,
      });
      tl.sync(cardAnim, base);

      if (marker) {
        tl.sync(
          waapi.animate(marker, {
            opacity: [0, 1],
            duration: 450,
            ease: 'out(2)',
            autoplay: false,
          }),
          base + 40
        );
      }

      if (indexEl) {
        tl.sync(
          waapi.animate(indexEl, {
            opacity: [0, 1],
            translateY: ['10px', '0px'],
            duration: 520,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 60
        );
      }

      if (line) {
        tl.sync(
          waapi.animate(line, {
            scaleX: [0, 1],
            opacity: [0.2, 1],
            duration: 700,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 80
        );
      }

      if (title) {
        tl.sync(
          waapi.animate(title, {
            opacity: [0, 1],
            translateY: ['18px', '0px'],
            duration: 620,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 120
        );
      }

      if (desc) {
        tl.sync(
          waapi.animate(desc, {
            opacity: [0, 1],
            translateY: ['14px', '0px'],
            duration: 620,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 180
        );
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.22 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      tl.cancel();
    };
  }, []);

  return (
    <section id="capabilities" className="capabilities-section" ref={sectionRef}>
      <div className="content-wrap capabilities-shell">
        <div className="capabilities-intro" ref={introRef}>
          <p className="eyebrow eyebrow-dark">Capabilities</p>
          <h2 className="section-title section-title-dark">
            What I
            <span>bring to the table.</span>
          </h2>
          <p className="capabilities-description">
            From full-stack development to creative problem solving, I build experiences that are practical, scalable and memorable.
          </p>
          <a href="#capability-grid" className="inline-link inline-link-dark" ref={linkRef}>
            Explore Skills
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div id="capability-grid" className="capability-grid">
          {capabilities.map((item, index) => (
            <article
              key={item.index}
              className="capability-card"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <div className="capability-marker" aria-hidden="true">
                <span className="capability-index">{item.index}</span>
                <span className="capability-line" />
              </div>
              <div className="capability-content">
                <h3 className="capability-title">{item.title}</h3>
                <p className="capability-desc">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
