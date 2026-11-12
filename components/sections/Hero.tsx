'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">
            SOFTWARE ENGINEER <span>CREATIVE TECHNOLOGIST</span>
          </p>
          <h1 className="hero-title">
            Solomon
            <span>Mwangi.</span>
          </h1>
          <p className="hero-subtitle">
            Engineering digital experiences where technology meets imagination.
          </p>
          <div className="hero-actions">
            <Link href="#work" className="button button-ghost">
              Explore More Work
              <span aria-hidden="true">→</span>
            </Link>
            <div className="hero-rail" aria-hidden="true" />
          </div>
        </div>

        <div className="hero-scene" aria-hidden="true">
          <div className="hero-arch" />
          <div className="hero-glow" />
          <div className="hero-figure" />
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-counter">01 / 07</div>
        </div>
      </div>
    </section>
  );
}
