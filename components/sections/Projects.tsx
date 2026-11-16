'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/projects';
import ParticleField from '@/components/particle-field/ParticleField';
import { GALAXY_A_LIGHT_FORM, GALAXY_A_LIGHT_SETTINGS } from '@/data/particle-field-presets';

const HOME_PROJECT_SLUGS = ['vet-claim', 'solomon', '01', 'pulse'] as const;

const imageBySlug: Record<string, string> = {
  'vet-claim': '/images/vet-claim.webp',
  'solomon': '/images/folio-v1.webp',
  '01': '/images/01.webp',
  pulse: '/images/pulse.jpg',
};

export default function Projects() {
  const featuredProjects = useMemo(
    () => HOME_PROJECT_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean),
    []
  );

  return (
    <section id="work" className="projects-section">
      <ParticleField settings={GALAXY_A_LIGHT_SETTINGS} form={GALAXY_A_LIGHT_FORM} overlay light />
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

        <div className="project-showcase">
          {featuredProjects.map((project, index) => {
            if (!project) return null;
            const imageSrc = imageBySlug[project.slug] ?? '/images/01.webp';

            return (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="project-card"
                aria-label={`Open ${project.title} case study`}
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
                  <span className="project-card-action">Open details</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}