'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ParticleFieldSettings, ParticleFormField } from '@/data/particle-field-presets';

interface LazyParticleFieldProps {
  settings: ParticleFieldSettings;
  form: ParticleFormField;
  className?: string;
  overlay?: boolean;
  light?: boolean;
  /** Distance in pixels before the viewport to start loading (default: 1000) */
  rootMargin?: string;
}

const ParticleField = dynamic(
  () => import('@/components/particle-field/ParticleField').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="particle-field" aria-hidden="true">
        <div className="particle-field__placeholder" />
      </div>
    ),
  },
);

/**
 * Wrapper that defers loading ParticleField until the element is near the viewport.
 * This prevents Three.js from loading for below-fold sections until the user scrolls near them.
 */
export default function LazyParticleField({
  settings,
  form,
  className,
  overlay,
  light,
  rootMargin = '1000px',
}: LazyParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasLoaded]);

  if (!hasLoaded) {
    return (
      <div
        ref={containerRef}
        className={`particle-field${light ? ' particle-field--light' : ''}${className ? ` ${className}` : ''}`}
        aria-hidden="true"
        style={{ width: '100%', height: '100%' }}
      >
        <div className="particle-field__placeholder" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`particle-field${light ? ' particle-field--light' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <ParticleField settings={settings} form={form} overlay={overlay} light={light} />
    </div>
  );
}