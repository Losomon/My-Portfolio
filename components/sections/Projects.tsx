'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createLayout } from 'animejs';
import { projects } from '@/lib/projects';

const HOME_PROJECT_SLUGS = ['vet-claim', 'folio-v1', '01'] as const;

const imageBySlug: Record<string, string> = {
  'vet-claim': '/images/vet-claim.webp',
  'folio-v1': '/images/folio-v1.webp',
  '01': '/images/01.webp',
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
      <div className="content-wrap">
        <div className="projects-head projects-head-editorial">
          <div>
            <p className="eyebrow eyebrow-dark">Selected Projects</p>
            <h2 className="section-title section-title-dark">
              A fluid editorial
              <span>project showcase.</span>
            </h2>
          </div>
          <Link href="/work" className="view-button">
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
                className={`project-entry${isActive ? ' is-expanded' : ''}`}
              >
                <button
                  type="button"
                  className="project-entry-toggle"
                  onClick={() => toggleProject(project.slug)}
                  aria-expanded={isActive}
                  aria-controls={panelId}
                >
                  <span className="project-entry-index">0{index + 1}</span>
                  <span className="project-entry-main">
                    <span className="project-entry-meta">
                      {project.category} — {project.title}
                    </span>
                    <span className="project-entry-sub">{project.role}</span>
                  </span>
                  <span className="project-entry-action">{isActive ? 'Close' : 'Open'}</span>
                </button>

                <div id={panelId} className="project-entry-body" aria-hidden={!isActive}>
                  <div className="project-entry-media">
                    <Image
                      src={imageSrc}
                      alt={`${project.title} screenshot`}
                      width={1400}
                      height={1000}
                      className="project-entry-image"
                    />
                  </div>
                  <div className="project-entry-detail">
                    <p className="project-entry-description">{project.description}</p>
                    <div className="project-entry-tech">
                      <span className="project-detail-label">Technologies</span>
                      <ul>
                        {project.stack.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="project-entry-links">
                      <Link href={`/work/${project.slug}`} className="inline-link inline-link-dark">
                        Case Study <span aria-hidden="true">→</span>
                      </Link>
                      <button type="button" className="project-close" onClick={() => toggleProject(project.slug)}>
                        Close
                      </button>
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
