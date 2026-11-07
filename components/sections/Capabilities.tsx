'use client';

import { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
    <section ref={sectionRef} className="py-32 md:py-48 bg-[var(--color-warm-cream)]">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="text-[var(--text-xs)] tracking-[0.2em] uppercase text-[var(--color-secondary-text)] mb-4 font-medium">
              Capabilities
            </h2>
            <p className="text-[var(--text-lg)] text-[var(--color-secondary-text)] leading-relaxed">
              A comprehensive toolkit for building robust, scalable, and beautiful digital products from the database to the pixel.
            </p>
          </div>

          <div className="md:col-span-8">
            <ul className="cap-list border-t border-[var(--color-deep-plum)]/10">
              {capabilities.map((cap, i) => (
                <li
                  key={i}
                  className="cap-item group border-b border-[var(--color-deep-plum)]/10"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(i)}
                  onBlur={() => setActiveIndex(null)}
                >
                  <a
                    href={`#${cap.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className={`
                      block py-6 md:py-8 text-[var(--text-xl)] md:text-[var(--text-3xl)] font-['Times_New_Roman']
                      transition-all duration-500 ease-[var(--ease-out-expo)]
                      ${activeIndex === i ? 'text-[var(--color-electric-violet)] pl-8' : 'text-[var(--color-deep-plum)] pl-0'}
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-electric-violet)] focus-visible:rounded-sm
                    `}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span>{cap}</span>
                      <span className={`
                        text-[var(--text-sm)] font-['Satoshi'] tracking-widest uppercase
                        transition-opacity duration-300
                        ${activeIndex === i ? 'opacity-100' : 'opacity-0'}
                      `}>
                        Explore →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
