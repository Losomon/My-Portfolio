'use client';

import { projects } from '@/lib/projects';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorkPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the hero section while scrolling through work list
      gsap.to('.work-hero--desktop', {
        scrollTrigger: {
          trigger: '.work-hero--desktop',
          start: 'top top',
          end: '+=300%',
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });
    }, []);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navigation />
      <main id="work-scroll-range" className="work-page">
        <div data-scroll-container>
          <div data-scroll-section>
            <div className="container">
              <div className="wrapper" id="work-sticky-range">
                <section
                  className="work-hero is-intro work-hero--desktop"
                  data-work-hero
                  data-scroll
                  data-scroll-sticky
                  data-scroll-target="#work-sticky-range"
                  aria-labelledby="work-title"
                >
                  <div className="work-hero__content" data-work-intro data-rv-in>
                    <div className="work-hero__project">
                      <h1 id="work-title" className="work-hero__title">
                        <span className="work-hero__title-mask" data-work-title-mask data-rv="line">
                          <span className="work-hero__title-track">
                            <span className="work-hero__title-copy work-hero__title-copy--current" data-work-title data-work-title-current>
                              <span className="font-rox">S</span>elected
                            </span>
                            <span className="work-hero__title-copy work-hero__title-copy--next" data-work-title-next aria-hidden>
                              <span className="font-rox">S</span>elected
                            </span>
                          </span>
                        </span>
                        <span className="work-hero__title-mask" data-work-title-mask data-rv="line">
                          <span className="work-hero__title-track">
                            <span className="work-hero__title-copy work-hero__title-copy--current" data-work-title data-work-title-current>
                              <span className="font-rox">W</span>ork
                            </span>
                            <span className="work-hero__title-copy work-hero__title-copy--next" data-work-title-next aria-hidden>
                              <span className="font-rox">W</span>ork
                            </span>
                          </span>
                        </span>
                      </h1>
                      <div className="work-hero__meta">
                        <p className="work-hero__description">
                          <span className="work-hero__line-mask text-reveal-mask">
                            <span className="work-hero__description-line">A selection of projects exploring</span>
                          </span>
                          <span className="work-hero__line-mask text-reveal-mask">
                            <span className="work-hero__description-line">web design, development, and digital experiences.</span>
                          </span>
                        </p>
                        <div className="work-hero__line-mask work-hero__services-mask text-reveal-mask">
                          <p className="work-hero__services">(Case Study Coming Soon)</p>
                        </div>
                      </div>
                    </div>

                    <div className="work-hero__details" data-work-details>
                      <dl className="work-hero__details-list">
                        <div className="work-hero__detail" data-work-meta-row="primary">
                          <div className="work-hero__detail-mask" data-rv="line">
                            <dt className="work-hero__detail-label" data-work-meta-motion>Client</dt>
                          </div>
                          <div className="work-hero__detail-mask" data-rv="line">
                            <dd className="work-hero__detail-value" data-work-meta-motion>VetClaim Advantage</dd>
                          </div>
                        </div>
                        <div className="work-hero__detail" data-work-meta-row="role">
                          <div className="work-hero__detail-mask" data-rv="line">
                            <dt className="work-hero__detail-label" data-work-meta-motion>Role</dt>
                          </div>
                          <div className="work-hero__detail-mask" data-rv="line">
                            <dd className="work-hero__detail-value" data-work-meta-motion>Design, Development</dd>
                          </div>
                        </div>
                        <div className="work-hero__detail" data-work-meta-row="year">
                          <div className="work-hero__detail-mask" data-rv="line">
                            <dt className="work-hero__detail-label" data-work-meta-motion>Year</dt>
                          </div>
                          <div className="work-hero__detail-mask" data-rv="line">
                            <dd className="work-hero__detail-value" data-work-meta-motion>2026</dd>
                          </div>
                        </div>
                      </dl>
                    </div>

                    <div className="work-hero__counter-mask text-reveal-mask">
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

                  <div className="work-hero__rail">
                    <div className="work-hero__track" data-work-track>
                      {projects.flatMap(() => projects).map((project, index) => (
                        <div key={project.slug + index} className="work-hero__card">
                          <Image
                            src={`/images/${project.slug}.webp`}
                            alt={project.title}
                            width={1254}
                            height={1254}
                            className="work-hero__media"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="work-list">
                  {projects.map((project, index) => (
                    <article key={project.slug} className="work-list__item" data-scroll data-scroll-offset="15%" data-rv-in>
                      <div className="work-list__header">
                        <div className="work-list__heading">
                          <h2 className="work-list__title">
                            <span className="work-list__title-mask" data-rv="line">
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

                <div className="work-transition-veil" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
