'use client';

import Link from 'next/link';
import { gsap } from 'gsap';
import { useGsapContext } from '@/lib/gsap';

export default function Hero() {
  const heroRef = useGsapContext(() => {
    gsap.fromTo(
      '.hero-reveal',
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' }
    );
  });

  return (
    <section ref={heroRef} className="hero-section section-dark" aria-label="Introduction">
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker hero-reveal">Software engineer <span>·</span> Creative technologist</p>
          <h1 className="hero-title hero-reveal">
            I build digital
            <br />
            products with
            <br />
            <em>a little more feeling.</em>
          </h1>
          <p className="hero-description hero-reveal">
            Thoughtful engineering for useful, human-centered experiences — from the first idea to the details that make it work.
          </p>
          <div className="hero-actions hero-reveal">
            <Link href="#work" className="button button-light">Explore selected work <span aria-hidden="true">↘</span></Link>
            <Link href="#about" className="text-link text-link-light">A little about me <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="hero-art hero-reveal" aria-hidden="true">
          <div className="hero-art-orbit hero-art-orbit-one" />
          <div className="hero-art-orbit hero-art-orbit-two" />
          <div className="hero-art-object">
            <div className="hero-art-glow" />
            <div className="hero-shelf">
              <span className="book book-one" />
              <span className="book book-two" />
              <span className="book book-three" />
              <span className="book book-four" />
              <span className="book book-five" />
              <span className="shelf-line" />
              <span className="shelf-line shelf-line-lower" />
            </div>
          </div>
          <p className="hero-art-caption">Ideas, made tangible <span>— 01</span></p>
        </div>

        <div className="hero-bottom">
          <span>Solomon <span className="hero-bottom-separator">/</span> Portfolio</span>
          <a href="#work" className="scroll-cue">Scroll to explore <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
