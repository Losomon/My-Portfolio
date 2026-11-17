'use client';

import { useEffect, useRef } from 'react';
import type { ParticleFieldSettings, ParticleFormField } from '@/data/particle-field-presets';

interface ParticleFieldProps {
  settings: ParticleFieldSettings;
  form: ParticleFormField;
  className?: string;
  /** Draw a dark scrim over the canvas so overlaid content stays readable. */
  overlay?: boolean;
  /**
   * When true the field auto-reduces its workload on coarse-pointer (mobile)
   * devices and small viewports: far fewer particles, no bloom, lower opacity,
   * and it pauses when scrolled out of view. Keeps the section light.
   */
  light?: boolean;
}

/** Scale a settings object down for low-end / mobile devices. */
function reduceSettings(s: ParticleFieldSettings): ParticleFieldSettings {
  return {
    ...s,
    count: Math.round(s.count * 0.25),
    size: s.size * 0.85,
    speed: s.speed * 0.55,
    opacity: s.opacity * 0.5,
    bloomStrength: 0,
    bloomRadius: 0,
    bloomThreshold: 1,
  };
}

function shouldReduceForDevice(settings: ParticleFieldSettings, light?: boolean): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  if (light && coarse) return true;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  return cores <= 4 || mem <= 4 || settings.count > 25000;
}

function getDprCap(light?: boolean): number {
  if (typeof window === 'undefined') return 1.25;
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  if (coarse) return 1;
  if (light) return 1.1;
  return 1.25;
}

/**
 * Full-bleed GPU particle field (three.js). The canvas fills this component's
 * container (CSS 100% × 100%) and re-mounts on resize. Rendering pauses while
 * the element is off-screen. three + the engine are imported dynamically so
 * they never run during SSR.
 */
export default function ParticleField({ settings, form, className, overlay, light }: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let cancelled = false;
    let cleanup = () => {};

    import('./engine').then(({ ParticleStudio }) => {
      if (cancelled) return;

      // Mobile / low-end: drop the bloom pass and particle count so the
      // section stays responsive and cool on phones.
      const activeSettings = shouldReduceForDevice(settings, light) ? reduceSettings(settings) : settings;
      const studio = new ParticleStudio(canvas, { ...activeSettings });
      const DPR_CAP = getDprCap(light);

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        studio.resize(w, h, Math.min(window.devicePixelRatio || 1, DPR_CAP));
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(container);

      // First form: particles "gather" in from a wide sphere (scale 4), morph 2.6 s.
      studio.showForm(form.kind, form.seed, 'gather');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        studio.setSpeed(Math.min(settings.speed, 0.12));
      }

      let playing = true;
      let last = performance.now();
      const io = new IntersectionObserver(
        ([entry]) => {
          playing = entry.isIntersecting;
          last = performance.now();
        },
        { threshold: 0.01 },
      );
      io.observe(container);

      let raf = 0;
      let lastRender = 0;
      const targetInterval = light ? 1000 / 30 : 1000 / 45;
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!playing || document.hidden) {
          last = now;
          return;
        }
        if (now - lastRender < targetInterval) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        lastRender = now;
        studio.renderFrame(dt);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        studio.dispose();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [settings, form, light]);

  return (
    <div
      ref={containerRef}
      className={`particle-field${light ? ' particle-field--light' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="particle-field__canvas" />
      {overlay ? <div className="particle-field__overlay" /> : null}
    </div>
  );
}