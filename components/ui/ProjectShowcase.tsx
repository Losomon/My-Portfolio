'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/projects';
import { useGsapContext } from '@/lib/gsap';
import { gsap } from 'gsap';

interface Props {
  project: Project;
  index: number;
}

interface TransitionOrigin {
  left: number;
  top: number;
  width: number;
  height: number;
  expanded: boolean;
}

function StocklyInterface() {
  return (
    <div className="stockly-interface" aria-hidden="true">
      <div className="mock-browser-bar">
        <span /><span /><span />
        <p>stockly.app / overview</p>
        <b>•••</b>
      </div>
      <div className="mock-dashboard">
        <aside className="mock-sidebar">
          <strong>stockly<span>.</span></strong>
          <span className="mock-nav-active">▦ &nbsp; Overview</span>
          <span>□ &nbsp; Products</span>
          <span>↗ &nbsp; Movements</span>
          <span>◷ &nbsp; Suppliers</span>
          <div className="mock-sidebar-bottom">Small shop workspace</div>
        </aside>
        <div className="mock-main">
          <div className="mock-heading">
            <div><small>MONDAY, 09 NOVEMBER</small><strong>Good morning.</strong></div>
            <span className="mock-avatar">S</span>
          </div>
          <div className="mock-metrics">
            <div><small>Products</small><strong>248</strong><span>in your catalogue</span></div>
            <div><small>Stock value</small><strong>KSh 84,250</strong><span>across all products</span></div>
            <div className="mock-alert"><small>Low stock</small><strong>08</strong><span>need your attention</span></div>
          </div>
          <div className="mock-bottom">
            <div className="mock-chart">
              <div><strong>Stock movement</strong><small>Last 7 days</small></div>
              <svg viewBox="0 0 360 100" preserveAspectRatio="none">
                <path d="M0 78 C28 74 28 45 58 54 S87 70 112 49 S150 45 174 58 S211 29 236 39 S275 54 298 25 S337 38 360 12" />
                <path className="mock-chart-fill" d="M0 78 C28 74 28 45 58 54 S87 70 112 49 S150 45 174 58 S211 29 236 39 S275 54 298 25 S337 38 360 12 V100 H0Z" />
              </svg>
            </div>
            <div className="mock-product-list">
              <strong>Needs attention</strong>
              <span><i /> Maize flour <b>2 left</b></span>
              <span><i /> Cooking oil <b>4 left</b></span>
              <span><i /> Laundry soap <b>5 left</b></span>
            </div>
          </div>
          <span className="mock-concept-label">Interface concept</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectShowcase({ project, index }: Props) {
  const router = useRouter();
  const previewRef = useRef<HTMLButtonElement>(null);
  const [transition, setTransition] = useState<TransitionOrigin | null>(null);

  const cardRef = useGsapContext(() => {
    gsap.fromTo(
      '.project-card-content',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-card', start: 'top 85%' },
      }
    );
    gsap.fromTo(
      '.project-card-media',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-card', start: 'top 85%' },
      }
    );
  });

  function openCaseStudy() {
    const bounds = previewRef.current?.getBoundingClientRect();
    if (!bounds || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(`/work/${project.slug}`);
      return;
    }

    setTransition({
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      expanded: false,
    });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransition((current) => current ? { ...current, expanded: true } : null);
      });
    });
    window.setTimeout(() => router.push(`/work/${project.slug}`), 620);
  }

  return (
    <>
      <article ref={cardRef} className="project-card">
        <div className="project-card-content">
          <div className="project-meta">
            <span>0{index + 1} / {project.category}</span>
            <span className={`project-status status-${project.status.toLowerCase().replaceAll(' ', '-')}`}>{project.status}</span>
          </div>
          <h3>{project.title}<span className="project-period">.</span></h3>
          <p className="project-description">{project.description}</p>
          <div className="project-detail">
            <div><span>Role</span><strong>{project.role}</strong></div>
            <div><span>Toolkit</span><strong>{project.stack.join(' · ')}</strong></div>
          </div>
          <p className="project-status-note">{project.statusNote}</p>
          <button type="button" className="text-link project-link" onClick={openCaseStudy}>
            Enter the case study <span aria-hidden="true">↗</span>
          </button>
        </div>

        <button
          ref={previewRef}
          type="button"
          className="project-card-media"
          onClick={openCaseStudy}
          aria-label={`Open ${project.title} case study`}
        >
          <StocklyInterface />
          <span className="project-preview-cta">Enter project <span aria-hidden="true">↗</span></span>
        </button>
      </article>
      {transition && (
        <div
          className={`project-transition${transition.expanded ? ' is-expanded' : ''}`}
          style={{
            left: transition.left,
            top: transition.top,
            width: transition.width,
            height: transition.height,
          }}
          aria-hidden="true"
        >
          <StocklyInterface />
        </div>
      )}
    </>
  );
}
