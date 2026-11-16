'use client';

import { useEffect, useRef } from 'react';
import { createTimeline, waapi } from 'animejs';
import TEMPLATE from '@/lib/motion-templates/cover-ring';

const DPR_CAP = 2;
const LOOP_SECONDS = 14.0;
const SLOT_COUNT = 8;
const IMAGE_SRC = ['/images/01.webp', '/images/02.webp', '/images/03.webp', '/images/04.webp'];

const PARAMS = {
  cornerRadius: 3,
  padding: 6,
  shadowEnabled: false,
  cardSize: 37,
  cardAspect: '1:1',
  ringSize: 131,
  tilt: 0,
  perspective: 55,
  backFade: 55,
  direction: 'right',
  motion: 'steps',
  offsetX: 0,
  offsetY: 0,
  backgroundType: 'color',
  background: 'rgba(0,0,0,0)',
};

const BACKGROUND = { kind: 'colour' as const, value: '#0c0b10' };

const capabilities = [
  { index: '01', title: 'Frontend', description: 'Crafting interfaces that feel intuitive and precise.', icon: '▲' },
  { index: '02', title: 'Backend', description: 'Designing systems that scale with real business needs.', icon: '●' },
  { index: '03', title: 'Data', description: 'Turning complexity into clear, informed decisions.', icon: '■' },
  { index: '04', title: 'Creative Tech', description: 'Using technology as a creative medium for expression.', icon: '◆' },
];

type Background = { kind: 'colour'; value: string } | { kind: 'gradient'; angle: number; from: string; to: string };

function paintBehind(ctx: CanvasRenderingContext2D, bg: Background, w: number, h: number) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'destination-over';
  if (bg.kind === 'gradient') {
    const a = (bg.angle * Math.PI) / 180;
    const dx = Math.sin(a);
    const dy = -Math.cos(a);
    const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2;
    const g = ctx.createLinearGradient(w / 2 - dx * half, h / 2 - dy * half, w / 2 + dx * half, h / 2 + dy * half);
    g.addColorStop(0, bg.from);
    g.addColorStop(1, bg.to);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = bg.value;
  }
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const imagesRef = useRef<(HTMLImageElement | undefined)[]>(Array(SLOT_COUNT).fill(undefined));
  const rafRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    for (let i = 0; i < SLOT_COUNT; i++) {
      const img = new Image();
      img.src = IMAGE_SRC[i % IMAGE_SRC.length];
      img.onload = () => {
        images[i] = img;
      };
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.round(stage.clientWidth * dpr);
      canvas.height = Math.round(stage.clientHeight * dpr);
      draw();
    };

    let t = 0.12;
    let last = performance.now();

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      TEMPLATE.render({
        ctx,
        t,
        width: canvas.width,
        height: canvas.height,
        params: PARAMS,
        images,
        background: null,
      });
      paintBehind(ctx, BACKGROUND, canvas.width, canvas.height);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t = (t + dt / LOOP_SECONDS) % 1;
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resizeObserverRef.current = observer;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      draw();
      const reducedObserver = new ResizeObserver(draw);
      reducedObserver.observe(stage);
      return () => {
        observer.disconnect();
        reducedObserver.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    const link = linkRef.current;
    const cards = cardRefs.current.filter((el): el is HTMLElement => Boolean(el));
    if (!section || !intro || !link || cards.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const introAnim = waapi.animate(intro, {
      opacity: [0, 1],
      translateY: ['24px', '0px'],
      duration: 850,
      ease: 'out(3)',
      autoplay: false,
    });

    const linkAnim = waapi.animate(link, {
      opacity: [0, 1],
      translateX: ['-14px', '0px'],
      duration: 600,
      ease: 'out(3)',
      autoplay: false,
    });

    const tl = createTimeline({ autoplay: false }).sync(introAnim, 0).sync(linkAnim, 240);

    cards.forEach((card, index) => {
      const marker = card.querySelector<HTMLElement>('.capability-marker');
      const indexEl = card.querySelector<HTMLElement>('.capability-index');
      const line = card.querySelector<HTMLElement>('.capability-line');
      const title = card.querySelector<HTMLElement>('.capability-title');
      const desc = card.querySelector<HTMLElement>('.capability-desc');
      const icon = card.querySelector<HTMLElement>('.capability-icon');
      const base = 220 + index * 170;

      const cardAnim = waapi.animate(card, {
        opacity: [0, 1],
        translateY: ['28px', '0px'],
        duration: 700,
        ease: 'out(4)',
        autoplay: false,
      });
      tl.sync(cardAnim, base);

      if (icon) {
        tl.sync(
          waapi.animate(icon, {
            opacity: [0, 1],
            scale: [0.6, 1],
            rotate: [-12, 0],
            duration: 600,
            ease: 'out(4)',
            autoplay: false,
          }),
          base + 60
        );
      }

      if (marker) {
        tl.sync(
          waapi.animate(marker, {
            opacity: [0, 1],
            duration: 450,
            ease: 'out(2)',
            autoplay: false,
          }),
          base + 40
        );
      }

      if (indexEl) {
        tl.sync(
          waapi.animate(indexEl, {
            opacity: [0, 1],
            translateY: ['10px', '0px'],
            duration: 520,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 60
        );
      }

      if (line) {
        tl.sync(
          waapi.animate(line, {
            scaleX: [0, 1],
            opacity: [0.2, 1],
            duration: 700,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 80
        );
      }

      if (title) {
        tl.sync(
          waapi.animate(title, {
            opacity: [0, 1],
            translateY: ['18px', '0px'],
            duration: 620,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 120
        );
      }

      if (desc) {
        tl.sync(
          waapi.animate(desc, {
            opacity: [0, 1],
            translateY: ['14px', '0px'],
            duration: 620,
            ease: 'out(3)',
            autoplay: false,
          }),
          base + 180
        );
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.22 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      tl.cancel();
    };
  }, []);

  return (
    <section id="capabilities" className="capabilities-section" ref={sectionRef}>
      <div className="capabilities-stage" ref={stageRef}>
        <canvas className="capabilities-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="capabilities-intro" ref={introRef}>
          <p className="eyebrow eyebrow-dark reveal-char">Capabilities</p>
          <h2 className="section-title section-title-dark">
            What I
            <span className="reveal-char">bring to the table.</span>
          </h2>
          <p className="capabilities-description reveal-char">
            From full-stack development to creative problem solving, I build experiences that are practical,
            scalable and memorable.
          </p>
          <a href="#capability-grid" className="inline-link inline-link-dark" ref={linkRef}>
            Explore Skills
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="content-wrap">
        <div id="capability-grid" className="capability-grid">
          {capabilities.map((item, index) => (
            <article
              key={item.index}
              className="capability-card"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <div className="capability-marker" aria-hidden="true">
                <span className="capability-index">{item.index}</span>
                <span className="capability-line" />
              </div>
              <div className="capability-visual">
                <span className="capability-icon">{item.icon}</span>
              </div>
              <div className="capability-content">
                <h3 className="capability-title">{item.title}</h3>
                <p className="capability-desc">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
