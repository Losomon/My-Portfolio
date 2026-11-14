'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DragField } from './dragField';
import { PLAYGROUND_ROWS } from '@/lib/playground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const bezierEase = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (time: number) => {
    if (time <= 0) return 0;
    if (time >= 1) return 1;

    let t = time;
    for (let i = 0; i < 8; i += 1) {
      const error = sampleX(t) - time;
      if (Math.abs(error) < 1e-5) break;
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }

    return sampleY(t);
  };
};

const revealEase = bezierEase(0.76, 0, 0.24, 1);

export default function DragStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!wrap || !pin || !stage) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const field = new DragField(stage, { onFail: () => wrap.classList.add('is-fallback') });
    field.warm();

    const offsetTop = (element: HTMLElement) => {
      let top = 0;
      for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
      }
      return top;
    };

    const state = { local: 0, active: false, hintShown: false };
    let frame = 0;
    let hintTimer = 0;

    const clearHint = () => {
      window.clearTimeout(hintTimer);
      hintTimer = 0;
      stage.classList.remove('is-hint');
    };

    const scheduleHint = () => {
      window.clearTimeout(hintTimer);
      hintTimer = window.setTimeout(
        () => {
          state.hintShown = true;
          stage.classList.add('is-hint');
        },
        (state.hintShown ? 0.6 : 4.5) * 1000,
      );
    };

    const measure = () => {
      frame = 0;
      const span = pin.offsetHeight - stage.offsetHeight;
      const top = offsetTop(pin);
      const scroll = window.scrollY;
      const local = Math.min(Math.max(scroll - top, 0), Math.max(span, 0));
      const active = scroll >= top && scroll <= top + span;

      if (active) {
        const delta = local - state.local;
        if (state.active && delta !== 0) field.nudge(delta);
      }

      if (active !== state.active) {
        state.active = active;
        if (active) scheduleHint();
        else clearHint();
      }

      state.local = local;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    const onResize = () => {
      measure();
      ScrollTrigger.refresh();
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    let cursor: HTMLDivElement | null = null;
    let cursorInner: HTMLDivElement | null = null;
    let moveX: ((value: number) => void) | null = null;
    let moveY: ((value: number) => void) | null = null;
    let cursorVisible = false;

    const setCursorVisible = (visible: boolean) => {
      if (!cursor || visible === cursorVisible) return;
      cursorVisible = visible;
      gsap.to(cursor, {
        scale: visible ? 1 : 0,
        duration: (visible ? 0.4 : 0.25) * (reducedMotion ? 0 : 1),
        ease: visible ? 'power3.out' : 'power2.in',
        overwrite: 'auto',
      });
    };

    if (finePointer) {
      cursor = document.createElement('div');
      cursor.className = 'drag-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = '<span class="drag-cursor__inner">Drag</span>';
      cursorInner = cursor.firstElementChild as HTMLDivElement;
      document.body.appendChild(cursor);
      gsap.set(cursor, { scale: 0 });
      moveX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
      moveY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!cursor) return;
      moveX?.(event.clientX);
      moveY?.(event.clientY);

      const rect = stage.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      setCursorVisible(inside);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      setCursorVisible(false);
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      document.documentElement.classList.add('is-grabbing');
      if (cursorInner) gsap.to(cursorInner, { scale: 0.82, duration: 0.2, overwrite: 'auto' });
      clearHint();
    };

    const onUp = () => {
      if (!document.documentElement.classList.contains('is-grabbing')) return;
      document.documentElement.classList.remove('is-grabbing');
      if (cursorInner) {
        gsap.to(cursorInner, { scale: 1, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' });
      }
    };

    if (finePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerout', onPointerOut, { passive: true });
      stage.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      window.addEventListener('blur', onUp);
    }

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference) and (max-width: 1279px), (prefers-reduced-motion: no-preference) and (hover: none), (prefers-reduced-motion: no-preference) and (pointer: coarse)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-playground-card]');
        if (!cards.length) return undefined;

        const triggers: ScrollTrigger[] = [];
        const tweens: gsap.core.Timeline[] = [];

        cards.forEach((card) => {
          const media = card.querySelector<HTMLElement>(':scope > div');
          const image = card.querySelector<HTMLElement>('img');

          gsap.set(card, { clipPath: 'inset(0 0 100% 0)' });
          if (media) gsap.set(media, { scale: 1.04 });
          if (image) gsap.set(image, { scale: 1.06 });

          const timeline = gsap.timeline({ paused: true, defaults: { ease: revealEase } });
          timeline.to(card, { clipPath: 'inset(0 0 0% 0)', duration: 1 });
          if (media) timeline.to(media, { scale: 1, duration: 1.1 }, 0);
          if (image) timeline.to(image, { scale: 1, duration: 1.2 }, 0);

          triggers.push(
            ScrollTrigger.create({
              trigger: card,
              start: 'top 88%',
              once: true,
              onEnter: () => timeline.play(),
            }),
          );
          tweens.push(timeline);
        });

        return () => {
          triggers.forEach((trigger) => trigger.kill());
          tweens.forEach((timeline) => timeline.kill());
          cards.forEach((card) => {
            const media = card.querySelector<HTMLElement>(':scope > div');
            const image = card.querySelector<HTMLElement>('img');
            gsap.set(card, { clearProps: 'clipPath' });
            if (media) gsap.set(media, { clearProps: 'scale' });
            if (image) gsap.set(image, { clearProps: 'scale' });
          });
        };
      },
    );

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerout', onPointerOut);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', onUp);

      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(hintTimer);

      document.documentElement.classList.remove('is-grabbing');
      mm.revert();
      field.dispose();

      if (cursor) {
        gsap.killTweensOf([cursor, cursorInner].filter(Boolean) as Element[]);
        cursor.remove();
      }
    };
  }, []);

  return (
    <div className="pgs" ref={wrapRef}>
      <div className="pgd" data-playground-drag-pin ref={pinRef}>
        <section className="pgd__s" data-playground-drag ref={stageRef} aria-label="Playground experiments">
          <div className="pgd__cv" data-playground-drag-canvas aria-hidden="true" />
          <p className="pgd__h" data-playground-drag-hint>
            <span>
              <span>Scroll</span>
            </span>
          </p>
        </section>
      </div>

      <section className="pw" ref={gridRef} aria-label="Experiment grid">
        {PLAYGROUND_ROWS.map((row, rowIndex) => (
          <div className="pw__r" key={`row-${rowIndex}`}>
            {row.map((card) => (
              <article
                className="pw__c"
                data-playground-card
                key={card.src}
                style={
                  {
                    '--card-bg': card.bg,
                    ...(card.col ? { '--col': card.col } : {}),
                  } as CSSProperties
                }
              >
                <div>
                  <Image
                    src={card.src}
                    alt=""
                    fill
                    sizes="(max-width: 64rem) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </article>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}