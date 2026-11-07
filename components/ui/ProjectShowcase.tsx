'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/projects';
import { useGsapContext } from '@/lib/gsap';
import { gsap } from 'gsap';

interface Props {
  project: Project;
  index: number;
}

export default function ProjectShowcase({ project, index }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cardRef = useGsapContext(() => {
    gsap.fromTo('.project-card-content',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.project-card', start: 'top 85%' } }
    );

    gsap.fromTo('.project-card-media',
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.project-card', start: 'top 85%' } }
    );
  });

  const handleMediaEnter = () => {
    setIsHovered(true);
    if (videoRef.current && project.media.type === 'video') {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMediaLeave = () => {
    setIsHovered(false);
    if (videoRef.current && project.media.type === 'video') {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article ref={cardRef} className="project-card py-24 md:py-32 border-b border-[var(--color-warm-cream)]/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="project-card-content lg:col-span-5 space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[var(--text-xs)] tracking-[0.2em] uppercase text-[var(--color-lavender)] font-medium">
              {project.category}
            </span>
            <span className={`
              px-3 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold
              ${project.status === 'Production' ? 'bg-[var(--color-electric-violet)] text-[var(--color-warm-cream)]' :
                project.status === 'Prototype' ? 'bg-[var(--color-lavender)]/20 text-[var(--color-lavender)] border border-[var(--color-lavender)]/30' :
                'bg-[var(--color-warm-cream)]/10 text-[var(--color-warm-cream)] border border-[var(--color-warm-cream)]/20'}
            `}>
              {project.status}
            </span>
          </div>

          <h3 className="font-['Times_New_Roman'] text-[var(--text-3xl)] md:text-6xl leading-[1.05] text-[var(--color-warm-cream)]">
            {project.title}
          </h3>

          <p className="text-[var(--text-lg)] text-[var(--color-lavender)]/80 leading-relaxed max-w-lg">
            {project.description}
          </p>

          <div className="space-y-4 pt-4 border-t border-[var(--color-warm-cream)]/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-secondary-text)] block mb-1">Role</span>
                <p className="text-[var(--color-warm-cream)] text-sm">{project.role}</p>
              </div>
              <div>
                <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--color-secondary-text)] block mb-1">Stack</span>
                <p className="text-[var(--color-warm-cream)] text-sm">{project.stack.join(', ')}</p>
              </div>
            </div>

            <p className="text-[var(--text-sm)] text-[var(--color-lavender)]/70 italic border-l-2 border-[var(--color-electric-violet)] pl-4 mt-4">
              {project.statusNote}
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-electric-violet)] text-[var(--color-warm-cream)] rounded-full text-sm font-medium transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-deep-plum)]"
            >
              View Case Study
              <span aria-hidden="true">→</span>
            </Link>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-lavender)]/30 text-[var(--color-warm-cream)] rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[var(--color-lavender)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)]"
              >
                Live Site
              </a>
            )}
          </div>
        </div>

        <div className="project-card-media lg:col-span-7">
          <div
            className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-[var(--color-deep-plum)] shadow-[var(--shadow-xl)] cursor-pointer group"
            onMouseEnter={handleMediaEnter}
            onMouseLeave={handleMediaLeave}
            onFocus={handleMediaEnter}
            onBlur={handleMediaLeave}
            tabIndex={0}
            role="link"
            aria-label={`View case study for ${project.title}`}
            onClick={() => window.location.href = `/work/${project.slug}`}
            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/work/${project.slug}`)}
          >
            {project.media.type === 'video' ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                src={project.media.src}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              />
            ) : (
              <img
                src={project.media.src}
                alt={project.media.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                loading="lazy"
              />
            )}

            <div className={`
              absolute inset-0 bg-[var(--color-deep-plum)]/60 backdrop-blur-sm flex items-center justify-center
              transition-opacity duration-500
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <span className="px-6 py-3 bg-[var(--color-warm-cream)] text-[var(--color-deep-plum)] rounded-full font-medium text-sm shadow-lg">
                View Case Study →
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
