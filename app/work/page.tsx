'use client';

import { projects } from '@/lib/projects';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP = '(min-width: 1025px)';
const COUNTER_SLIDE_MS = 580;

const railCards = projects.flatMap((project) => projects.map(() => project));
const lead = projects[0] ?? {
  title: 'Selected Work',
  role: 'Design, Development',
};

export default function WorkPage() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealTargets = Array.from(
      root.current?.querySelectorAll<HTMLElement>('[data-scroll]') ?? [],
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-inview');
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    );

    for (const target of revealTargets) revealObserver.observe(target);

    const ctx = gsap.context(() => {
      const hero = root.current?.querySelector<HTMLElement>('[data-work-hero]');
      const track = root.current?.querySelector<HTMLElement>('[data-work-track]');
      const range = root.current?.querySelector<HTMLElement>('#work-sticky-range');
      if (!hero || !track || !range) return;

      const cards = Array.from(track.querySelectorAll<HTMLElement>('.work-hero__card'));
      if (!cards.length) return;

      const current = hero.querySelector<HTMLElement>('[data-work-counter-current]');
      const next = hero.querySelector<HTMLElement>('[data-work-counter-next]');
      const numberTrack = hero.querySelector<HTMLElement>('.work-hero__counter-number-track');

      const step = () => {
        const first = cards[0];
        if (!first) return 0;
        const gap = Number.parseFloat(getComputedStyle(track).columnGap || '0') || 0;
        return first.offsetWidth + gap;
      };

      let active = 0;
      let tick = 0;

      const paintCards = (index: number) => {
        for (const card of cards) {
          card.classList.toggle('is-dim', Number(card.dataset.projectIndex) !== index);
        }
      };

      const paintCounter = (index: number) => {
        if (!current || !next || !numberTrack) return;

        tick += 1;
        const mine = tick;
        const label = String(index + 1);

        numberTrack.classList.remove('is-next');
        void numberTrack.offsetWidth;
        next.textContent = label;
        numberTrack.classList.add('is-next');

        window.setTimeout(() => {
          if (mine !== tick) return;
          current.textContent = label;
          numberTrack.classList.remove('is-next');
        }, COUNTER_SLIDE_MS);
      };

      const setActive = (index: number) => {
        if (index === active) return;
        active = index;
        paintCards(index);
        paintCounter(index);
      };

      const projectAt = (progress: number) =>
        Math.min(Math.floor(progress * projects.length), projects.length - 1);

      const mm = gsap.matchMedia();

      mm.add(DESKTOP, () => {
        const tween = gsap.to(track, {
          x: () => step() * Math.max(cards.length - 1, 0),
          ease: 'none',
          scrollTrigger: {
            trigger: range,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.65,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(projectAt(self.progress)),
            onRefresh: (self) => setActive(projectAt(self.progress)),
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: 'transform' });
        };
      });

      paintCards(0);

      return () => mm.revert();
    }, root);

    return () => {
      revealObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <>
      <Navigation />
      <main id="work-scroll-range" className="work-page" ref={root}>
        <div className="work-hero-range" id="work-sticky-range">
          <section
            className="work-hero work-hero--desktop"
            data-work-hero
            aria-labelledby="work-title"
          >
            <div className="work-hero__content" data-work-intro>
              <div className="work-hero__project">
                <h1 id="work-title" className="work-hero__title">
                  <span className="work-hero__title-mask" data-work-title-mask>
                    <span className="work-hero__title-track">
                      <span className="work-hero__title-copy" data-work-title>
                        <span className="font-rox">S</span>elected
                      </span>
                    </span>
                  </span>
                  <span className="work-hero__title-mask" data-work-title-mask>
                    <span className="work-hero__title-track">
                      <span className="work-hero__title-copy" data-work-title>
                        <span className="font-rox">W</span>ork
                      </span>
                    </span>
                  </span>
                </h1>

                <div className="work-hero__meta">
                  <p className="work-hero__description">
                    <span className="work-hero__line-mask">
                      <span className="work-hero__description-line">A selection of projects exploring</span>
                    </span>
                    <span className="work-hero__line-mask">
                      <span className="work-hero__description-line">web design, development, and digital experiences.</span>
                    </span>
                  </p>
                  <div className="work-hero__line-mask work-hero__services-mask">
                    <p className="work-hero__services">(Scroll to move the rail)</p>
                  </div>
                </div>
              </div>

              <div className="work-hero__details" data-work-details>
                <dl className="work-hero__details-list">
                  <div className="work-hero__detail">
                    <div className="work-hero__detail-mask">
                      <dt className="work-hero__detail-label">Client</dt>
                    </div>
                    <div className="work-hero__detail-mask">
                      <dd className="work-hero__detail-value">{lead.title}</dd>
                    </div>
                  </div>
                  <div className="work-hero__detail">
                    <div className="work-hero__detail-mask">
                      <dt className="work-hero__detail-label">Role</dt>
                    </div>
                    <div className="work-hero__detail-mask">
                      <dd className="work-hero__detail-value">{lead.role}</dd>
                    </div>
                  </div>
                  <div className="work-hero__detail">
                    <div className="work-hero__detail-mask">
                      <dt className="work-hero__detail-label">Year</dt>
                    </div>
                    <div className="work-hero__detail-mask">
                      <dd className="work-hero__detail-value">2026</dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="work-hero__counter-mask">
                <div className="work-hero__counter" data-work-counter>
                  <span className="work-hero__counter-number-mask">
                    <span className="work-hero__counter-number-track">
                      <strong className="work-hero__counter-current" data-work-counter-current>1</strong>
                      <strong className="work-hero__counter-next" data-work-counter-next aria-hidden>1</strong>
                    </span>
                  </span>
                  <span className="work-hero__counter-separator">/</span>
                  <span className="work-hero__counter-total">{projects.length}</span>
                </div>
              </div>
            </div>

            <div className="work-hero__rail" aria-hidden="true">
              <div className="work-hero__track" data-work-track>
                {railCards.map((project, index) => (
                  <div
                    key={`${project.slug}-${index}`}
                    className="work-hero__card"
                    data-project-index={index % projects.length}
                  >
                    <Image
                      src={`/images/${project.slug}.webp`}
                      alt=""
                      width={1254}
                      height={1254}
                      className="work-hero__media"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="work-list">
          {projects.map((project, index) => (
            <article key={project.slug} className="work-list__item" data-scroll data-scroll-offset="15%">
              <div className="work-list__header">
                <div className="work-list__heading">
                  <h2 className="work-list__title">
                    <span className="work-list__title-mask">
                      <span className="work-list__title-line">
                        <span className="font-rox">{project.title.charAt(0)}</span>{project.title.slice(1)}
                      </span>
                    </span>
                  </h2>
                  <div className="work-list__intro">
                    <p className="work-list__description">{project.description}</p>
                    <p className="work-list__status">({project.status})</p>
                  </div>
                </div>
                <div className="work-list__counter">{index + 1}/{projects.length}</div>
              </div>

              <div className="work-list__bottom">
                <dl className="work-list__details">
                  <div className="work-list__detail">
                    <dt>Category</dt>
                    <dd>{project.category}</dd>
                  </div>
                  <div className="work-list__detail">
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div className="work-list__detail">
                    <dt>Year</dt>
                    <dd>2026</dd>
                  </div>
                </dl>

                <figure className="work-list__media">
                  <Image src={`/images/${project.slug}.webp`} alt={project.title} width={1917} height={927} />
                </figure>
              </div>
            </article>
          ))}
        </section>

        <Footer />
      </main>
    </>
  );
}