'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { createLayout } from 'animejs';
import { projects } from '@/lib/projects';

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<ReturnType<typeof createLayout> | null>(null);
  const [isList, setIsList] = useState(false);

  const toggleLayout = () => {
    if (!gridRef.current) return;
    if (!layoutRef.current) layoutRef.current = createLayout(gridRef.current);
    layoutRef.current.update(() => {
      setIsList((v) => !v);
    }, {
      duration: 700,
      ease: 'inOut(3)',
    });
  };

  return (
    <section id="work" className="projects-section">
      <div className="content-wrap">
        <div className="projects-head">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 className="section-title">
              Projects that
              <span>bring ideas to life.</span>
            </h2>
          </div>
          <div className="projects-actions">
            <button type="button" className="view-button layout-toggle" onClick={toggleLayout}>
              {isList ? 'Grid View' : 'List View'}
            </button>
            <Link href="/work" className="view-button">
              View All Projects
            </Link>
          </div>
        </div>

        <div ref={gridRef} className={`project-grid${isList ? ' is-list' : ''}`}>
          {projects.map((project, index) => (
            <Link key={project.slug} href={`/work/${project.slug}`} className={`project-card project-${project.slug}`}>
              <div className="project-card-visual" aria-hidden="true">
                <span className="visual-badge">{project.category}</span>
                <div className="visual-pattern" />
              </div>
              <div className="project-card-copy">
                <span className="project-index">0{index + 1}</span>
                <span className="project-kind">{project.category}</span>
                <h3>{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
