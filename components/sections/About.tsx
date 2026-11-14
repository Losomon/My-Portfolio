'use client';

import { useEffect, useRef } from 'react';
import { createDraggable, utils } from 'animejs';
import Silhouette from '@/components/ui/Silhouette';

const coordinates = [
  { label: 'Location', value: 'Kenya' },
  { label: 'Education', value: 'Computer Science, Kirinyaga University' },
  { label: 'Professional Direction', value: 'Software Engineering / Full-Stack Development' },
  { label: 'Disciplines', value: 'Frontend, Backend, Data, Creative Technology' },
  {
    label: 'Current Focus',
    value: 'Building practical software systems and experimenting with interactive digital experiences.',
  },
];

export default function About() {
  const figureRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="about" className="about-section">
      <div className="content-wrap">
        <div className="about-identity">
          <p className="about-kicker">Profile / 001</p>
          <h2 className="about-statement">
            Software engineer,
            <span>creative problem solver.</span>
          </h2>
        </div>

        <div className="about-body">
          <div className="about-narrative">
            <p>
              I approach software development as a process of making complexity usable. I start by understanding constraints, user needs, and the shape of the problem before deciding what deserves to be built.
            </p>
            <p>
              When I work through problems, I break them into clear systems, test assumptions early, and refine the details until the solution feels reliable and intentional. I care about building practical systems that hold up in real use.
            </p>
            <p>
              I am equally drawn to combining engineering with creative technology—using code, motion, and interaction as materials for thoughtful digital experiences, not just functional outputs.
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
          </div>
        </div>

        <div className="about-coordinates" aria-label="Personal coordinates">
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
      </div>
    </section>
  );
}