'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ARC = Math.PI * 0.6;
const FULL = Math.PI * 2;
const RAD_TO_DEG = 180 / Math.PI;
const FADE_BAND = 26;
const RADIUS_SCALE = 1.1;
const DESKTOP = '(min-width: 1201px)';

function observeReveals() {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-scroll]:not([data-scroll-section])'),
  );

  const byOffset = new Map<string, HTMLElement[]>();
  for (const el of targets) {
    const offset = el.dataset.scrollOffset ?? '0%';
    const bucket = byOffset.get(offset);
    if (bucket) bucket.push(el);
    else byOffset.set(offset, [el]);
  }

  const observers: IntersectionObserver[] = [];

  byOffset.forEach((elements, offset) => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: `0px 0px -${offset} 0px`, threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    observers.push(observer);
  });

  return () => observers.forEach((observer) => observer.disconnect());
}

function observeMedia() {
  const inners = Array.from(document.querySelectorAll<HTMLElement>('[data-srv-inner]'));
  const cleanups: Array<() => void> = [];

  for (const inner of inners) {
    const media = inner.querySelector<HTMLImageElement>('.srv__v img');
    if (!media) continue;

    const markReady = () => inner.classList.add('is-media-ready');

    if (media.complete) {
      markReady();
      continue;
    }

    media.addEventListener('load', markReady, { once: true });
    cleanups.push(() => media.removeEventListener('load', markReady));
  }

  return () => cleanups.forEach((fn) => fn());
}

function createCircularList() {
  const section = document.querySelector<HTMLElement>('[data-cir]');
  const track = section?.parentElement;
  const wrapper = section?.querySelector<HTMLElement>('[data-cir-list]');
  if (!section || !track || !wrapper) return () => {};

  const items = Array.from(wrapper.children) as HTMLElement[];
  const copy = section.querySelector<HTMLElement>('[data-cir-copy]');
  if (!items.length) return () => {};

  const spacing = ARC / items.length;
  const scrollRange = ((items.length - 1) * spacing) / FULL;

  let radius = 0;
  let centerX = 0;
  let centerY = 0;

  const render = (progress: number) => {
    const travelled = progress * scrollRange * FULL;

    for (let i = 0; i < items.length; i += 1) {
      const angle = i * spacing - travelled;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const deg = Math.atan2(sin, cos) * RAD_TO_DEG;
      const presence = gsap.utils.clamp(0, 1, 1 - Math.abs(deg) / FADE_BAND);
      const x = centerX + cos * radius;
      const y = centerY + sin * radius;
      const scale = 0.94 + presence * 0.06;

      const item = items[i];
      item.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${deg}deg) scale(${scale})`;
      item.style.opacity = String(0.32 + presence * 0.68);
    }
  };

  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    const measure = () => {
      centerX = window.innerWidth / 2;

      const sectionTop = section.getBoundingClientRect().top;
      const copyBottom = copy
        ? copy.getBoundingClientRect().bottom
        : sectionTop + window.innerHeight / 2;
      centerY = copyBottom - sectionTop - items[0].offsetHeight / 2;

      const width = gsap.utils.clamp(1200, 1500, window.innerWidth);
      const factor = gsap.utils.mapRange(1500, 1200, 1, 1.08, width);
      radius = (wrapper.offsetWidth / 2) * RADIUS_SCALE * factor;
    };

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onRefresh: (self) => {
        measure();
        render(self.progress);
      },
      onUpdate: (self) => render(self.progress),
    });

    measure();
    render(trigger.progress);

    return () => {
      trigger.kill();
      for (const item of items) {
        item.style.transform = '';
        item.style.opacity = '';
      }
    };
  });

  return () => mm.revert();
}

function createServiceShade() {
  const shades = Array.from(document.querySelectorAll<HTMLElement>('[data-srv-shade]'));
  const triggers: ScrollTrigger[] = [];

  for (const shade of shades) {
    const section = shade.closest<HTMLElement>('.srv');
    const next = section?.nextElementSibling;
    if (!section || !next) continue;

    const tween = gsap.fromTo(
      shade,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      },
    );

    const trigger = tween.scrollTrigger;
    if (trigger) triggers.push(trigger);
  }

  return () => triggers.forEach((trigger) => trigger.kill());
}

export default function AboutMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.classList.add('motion-on');

    const disposeReveals = observeReveals();
    const disposeMedia = observeMedia();
    const disposeCircle = createCircularList();
    const disposeShade = createServiceShade();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      disposeReveals();
      disposeMedia();
      disposeCircle();
      disposeShade();
      root.classList.remove('motion-on');
    };
  }, []);

  return null;
}