'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useGsapContext, useReducedMotion } from '@/lib/gsap';

export default function Hero() {
  const heroRef = useGsapContext((ctx) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero-video',
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.5 }
    )
    .fromTo('.hero-label',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=1'
    )
    .fromTo('.hero-title-line',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.15 },
      '-=0.6'
    )
    .fromTo('.hero-ctas',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.4'
    );
  });

  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden section-dark"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 z-0">
        <video
          className="hero-video w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.avif"
          aria-hidden="true"
        >
          <source src="/videos/hero-abstract.webm" type="video/webm" />
          <source src="/videos/hero-abstract.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#271A3D]/80 via-[#271A3D]/60 to-[#271A3D]/90" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-7xl text-center">
        <span className="hero-label block text-[var(--color-lavender)] text-sm md:text-base tracking-[0.2em] uppercase mb-6 font-medium">
          Software Engineer & Creative Technologist
        </span>

        <h1 className="hero-title font-['Times_New_Roman'] text-[var(--text-4xl)] leading-[1.1] font-normal text-[var(--color-warm-cream)] mb-8">
          <span className="block overflow-hidden">
            <span className="hero-title-line inline-block">Engineering digital</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-title-line inline-block text-[var(--color-electric-violet)]">experiences.</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-title-line inline-block">Creating what comes next.</span>
          </span>
        </h1>

        <div className="hero-ctas flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link
            href="#work"
            className="px-8 py-4 bg-[var(--color-electric-violet)] text-[var(--color-warm-cream)] rounded-full font-medium transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-deep-plum)]"
          >
            Explore My Work
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 border border-[var(--color-lavender)] text-[var(--color-warm-cream)] rounded-full font-medium transition-colors duration-300 hover:bg-[var(--color-lavender)] hover:text-[var(--color-deep-plum)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)]"
          >
            Let's Talk
          </Link>
        </div>
      </div>
    </section>
  );
}
