'use client';

import Link from 'next/link';
import { gsap } from 'gsap';
import { useGsapContext } from '@/lib/gsap';
import LibraryScene from '@/components/ui/LibraryScene';

export default function Hero() {
  const heroRef = useGsapContext(() => {
    gsap.fromTo(
      '.hero-reveal',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.14, ease: 'power3.out', delay: 0.45 }
    );
  });

  return (
    <section ref={heroRef} className="hero-section section-dark library-hero" aria-label="Introduction">
      <LibraryScene />
      <div className="library-hero-shade" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker hero-reveal">01 / The digital library <span>·</span> After hours</p>
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
          <span>Solomon <span className="hero-bottom-separator">/</span> Portfolio 2026</span>
          <span className="library-scene-caption">A study in light, wood &amp; wonder</span>
          <a href="#work" className="scroll-cue">Take a look around <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
