'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createLayout } from 'animejs';
import { projects } from '@/lib/projects';
import ParticleField from '@/components/particle-field/ParticleField';
import { GALAXY_A_FORM, GALAXY_A_SETTINGS } from '@/data/particle-field-presets';

const HOME_PROJECT_SLUGS = ['vet-claim', 'folio-v1', '01', 'pulse'] as const;

const imageBySlug: Record<string, string> = {
  'vet-claim': '/images/vet-claim.webp',
  'folio-v1': '/images/folio-v1.webp',
  '01': '/images/01.webp',
  pulse: '/images/pulse.jpg',
};

export default function Projects() {
  const listRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<ReturnType<typeof createLayout> | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const featuredProjects = useMemo(
    () => HOME_PROJECT_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean),
    []
  );

  const toggleProject = (slug: string) => {
    if (!listRef.current) return;
    if (!layoutRef.current) layoutRef.current = createLayout(listRef.current);

    layoutRef.current.update(
      () => {
        setActiveSlug((current) => (current === slug ? null : slug));
      },
      {
        duration: 820,
        ease: 'inOut(4)',
      }
    );
  };

  return (
    <section id="work" className="projects-section">
      <ParticleField settings={GALAXY_A_SETTINGS} form={GALAXY_A_FORM} overlay />
      <div className="content-wrap">
        <div className="projects-head">
          <div>
            <p className="eyebrow eyebrow-dark reveal-char">Selected Projects</p>
            <h2 className="section-title section-title-dark">
              A fluid editorial
              <span className="reveal-char">project showcase.</span>
            </h2>
          </div>
          <Link href="/work" className="view-button reveal-char">
            View All Projects
          </Link>
        </div>

        <div ref={listRef} className={`project-showcase${activeSlug ? ' has-active' : ''}`}>
          {featuredProjects.map((project, index) => {
            if (!project) return null;
            const isActive = activeSlug === project.slug;
            const imageSrc = imageBySlug[project.slug] ?? '/images/01.webp';
            const panelId = `project-panel-${project.slug}`;

            return (
              <article
                key={project.slug}
                data-layout-id={`project-${project.slug}`}
                className={`project-card${isActive ? ' is-expanded' : ''}`}
              >
                <button
                  type="button"
                  className="project-card-toggle"
                  onClick={() => toggleProject(project.slug)}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                >
                  <div className="project-card-media">
                    <Image
                      src={imageSrc}
                      alt={`${project.title} screenshot`}
                      width={800}
                      height={600}
                      className="project-card-image"
                      loading="lazy"
                    />
                    <div className="project-card-overlay">
                      <span className="project-card-category">{project.category}</span>
                      <span className="project-card-role">{project.role}</span>
                    </div>
                    <span className="project-card-index reveal-char">0{index + 1}</span>
                  </div>
                  <div className="project-card-content">
                    <h3 className="project-card-title reveal-char">
                      {project.title}
                      <span className="project-card-title-sub">{project.role}</span>
                    </h3>
                    <p className="project-card-description reveal-char">{project.description}</p>
                    <div className="project-card-stack reveal-char">
                      {project.stack.map((item) => (
                        <span key={item} className="project-card-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                    <span className="project-card-action">{isActive ? 'Close details' : 'Open details'}</span>
                  </div>
                </button>

                <div id={panelId} className="project-card-body" aria-hidden={!isActive}>
                  <div className="project-card-expand">
                    <div className="project-card-expand-media">
                      <Image
                        src={imageSrc}
                        alt={`${project.title} detail`}
                        width={1400}
                        height={1000}
                        className="project-card-expand-image"
                      />
                    </div>
                    <div className="project-card-expand-detail">
                      <p className="project-card-expand-description">{project.description}</p>
                      <div className="project-card-expand-tech">
                        <span className="project-detail-label">Technologies</span>
                        <ul>
                          {project.stack.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="project-card-expand-links">
                        <Link href={`/work/${project.slug}`} className="inline-link inline-link-dark">
                          Case Study <span aria-hidden="true">→</span>
                        </Link>
                        <button type="button" className="project-close" onClick={() => toggleProject(project.slug)}>
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
