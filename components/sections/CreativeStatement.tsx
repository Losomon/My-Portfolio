'use client';

import { useGsapContext } from '@/lib/gsap';
import { gsap } from 'gsap';

export default function CreativeStatement() {
  const sectionRef = useGsapContext(() => {
    const words = document.querySelectorAll('.statement-word');

    gsap.fromTo(words,
      { opacity: 0.15, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.statement-container',
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 1,
        }
      }
    );
  });

  const text = "Good software does more than work. It solves problems, creates clarity, and makes complex experiences feel effortless.";
  const words = text.split(' ');

  return (
    <section ref={sectionRef} className="section-dark py-32 md:py-48 overflow-hidden">
      <div className="statement-container container mx-auto px-6 md:px-12 max-w-6xl">
        <h2 className="font-['Times_New_Roman'] text-[var(--text-3xl)] md:text-[5.5rem] leading-[1.15] text-[var(--color-warm-cream)] font-normal">
          {words.map((word, i) => (
            <span key={i} className="statement-word inline-block mr-[0.25em] transition-colors duration-300">
              {word}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
