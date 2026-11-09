'use client';

import { useGsapContext } from '@/lib/gsap';
import { gsap } from 'gsap';

const capabilities = [
  'Frontend Engineering',
  'Backend Development',
  'API Development',
  'Database Design',
  'Full-Stack Development',
  'E-commerce Systems',
  'Business Automation',
  'UI Implementation',
  'Performance & Security'
];

export default function Capabilities() {
  const sectionRef = useGsapContext(() => {
    gsap.fromTo('.cap-item',
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cap-list',
          start: 'top 80%',
        }
      }
    );
  });

  return (
    <section ref={sectionRef} className="capabilities-section">
      <div className="content-wrap capabilities-grid">
        <div className="capabilities-intro">
          <p className="eyebrow">What I bring</p>
          <h2 className="capabilities-title">From the data<br />to the details.</h2>
          <p className="capabilities-description">
            A practical toolkit for building robust, scalable products — and making them feel effortless.
          </p>
        </div>
        <ul className="cap-list">
          {capabilities.map((cap, i) => (
            <li key={cap} className="cap-item">
              <span className="cap-number">0{i + 1}</span>
              <span>{cap}</span>
              <span className="cap-arrow" aria-hidden="true">↗</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
