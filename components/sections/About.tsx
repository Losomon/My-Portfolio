'use client';

import { useEffect, useRef } from 'react';
import { createDraggable, stagger, utils, waapi } from 'animejs';
import Silhouette from '@/components/ui/Silhouette';
import Link from 'next/link';
import Image from 'next/image';

const coordinates = [
  { label: 'Location', value: 'Nairobi, Kenya' },
  { label: 'Education', value: 'Computer Science, Kirinyaga University' },
  { label: 'Direction', value: 'Software Engineering / Full-Stack' },
  { label: 'Disciplines', value: 'Frontend · Backend · Data · Creative Tech' },
  {
    label: 'Current Focus',
    value: 'Building practical software systems and interactive digital experiences.',
  },
];

const gallery = [
  '/images/about-img-1.webp',
  '/images/about-img-2.webp',
  '/images/about-img-3.webp',
  '/images/about-img-4.webp',
];

export default function About() {
  const figureRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    const stage = stageRef.current;
    if (!figure || !stage) return;

    utils.set(figure, { z: 90, rotateX: 0, rotateY: 0 });
    utils.set(stage, { perspective: '1000px' });

    const draggable = createDraggable(figure, {
      container: stage,
      x: { mapTo: 'rotateY' },
      y: { mapTo: 'rotateX' },
      releaseEase: 'outElastic(1, .55)',
      cursor: { onHover: 'grab', onGrab: 'grabbing' },
    });

    return () => {
      draggable.revert();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    if (!section || !intro) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = intro.querySelectorAll('.reveal-char');
    const ups = section.querySelectorAll('.reveal-up');

    const charAnim = waapi.animate(chars, {
      opacity: [0, 1],
      translateY: ['30px', 0],
      duration: 800,
      easing: 'cubic-bezier(.25, 1, .5, 1)',
      delay: stagger(40),
      autoplay: false,
    });

    const upAnim = waapi.animate(ups, {
      opacity: [0, 1],
      translateY: ['40px', 0],
      duration: 800,
      easing: 'cubic-bezier(.25, 1, .5, 1)',
      delay: stagger(100),
      autoplay: false,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            charAnim.play();
            upAnim.play();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      charAnim.cancel();
      upAnim.cancel();
    };
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-shell">
        <div className="about-intro" ref={introRef}>
          <p className="about-kicker reveal-char">Profile / 001</p>
          <h2 className="about-statement">
            Software engineer,
            <br />
            <span className="reveal-char">creative technologist.</span>
          </h2>
          <p className="about-lead reveal-char">
            I build software that turns complexity into clarity — blending engineering rigor with creative
            technology to craft experiences that feel intentional and reliable.
          </p>
        </div>

        <div className="about-body">
          <div className="about-narrative">
            <p className="reveal-up">
              My process starts by understanding constraints, user needs, and the shape of the problem before
              deciding what deserves to be built. I break challenges into clear systems, test assumptions early,
              and refine the details until the solution feels dependable.
            </p>
            <p className="reveal-up">
              I am equally drawn to the intersection of code and creative technology — using motion, interaction,
              and systems thinking as materials for thoughtful digital experiences, not just functional outputs.
            </p>
          </div>

          <div className="about-visual" aria-label="Interactive visual identity">
            <div ref={stageRef} className="about-visual-stage">
              <div ref={figureRef} className="about-figure" role="img" aria-label="Draggable silhouette artwork">
                <Silhouette className="about-silhouette" fill="currentColor" />
              </div>
              <div className="about-visual-meta">
                <span>Visual Identity</span>
                <span>Drag to rotate</span>
              </div>
            </div>
            <div className="about-gallery">
              {gallery.map((src, i) => (
                <figure key={i} className="about-gallery-item reveal-up">
                  <Image src={src} alt={`Studio detail ${i + 1}`} width={600} height={750} className="about-gallery-image" loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="about-coordinates reveal-up" aria-label="Personal coordinates">
          <p className="about-coordinates-title">Personal Coordinates</p>
          <dl className="about-index">
            {coordinates.map((item) => (
              <div key={item.label} className="about-index-row">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about-divider reveal-up">
          <Link href="#work" className="about-view-work">
            View selected work <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
