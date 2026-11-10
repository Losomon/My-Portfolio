'use client';

import Link from 'next/link';
import { gsap } from 'gsap';
import { useGsapContext } from '@/lib/gsap';
import LibraryScene from '@/components/ui/LibraryScene';

export default function Hero() {
  const heroRef = useGsapContext(() => {
    const playReveal = () => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 32, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.15 }
      );
    };

    playReveal();

    window.addEventListener('portfolio-entered', playReveal);
    return () => window.removeEventListener('portfolio-entered', playReveal);
  });

  return (
    <section ref={heroRef} className="hero-section section-dark library-hero" aria-label="Introduction">
      <LibraryScene />
      <div className="library-hero-shade" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker hero-reveal">Solomon Mwangi <span>·</span> The Digital Library</p>
          <h1 className="hero-title hero-reveal">
            I build digital
            <br />
            worlds with
            <br />
            <em>a little more feeling.</em>
          </h1>
          <p className="hero-description hero-reveal">
            Thoughtful engineering for useful, human-centered experiences. Made with curiosity, care, and a little room to wander.
          </p>
          <div className="hero-actions hero-reveal">
            <Link href="#work" className="button button-library">Explore selected work <span aria-hidden="true">↘</span></Link>
            <Link href="#about" className="text-link text-link-light">A little about me <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="hero-bottom">
          <span>Solomon Mwangi <span className="hero-bottom-separator">/</span> Portfolio 2026</span>
          <span className="library-scene-caption">A study in light, wood &amp; wonder</span>
          <a href="#work" className="scroll-cue">Take a look around <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
