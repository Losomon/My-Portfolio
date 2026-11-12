'use client';

import Link from 'next/link';
import { useState } from 'react';
import Silhouette from '@/components/ui/Silhouette';

type HeroMode = 'editorial' | 'brutalism';

export default function Hero() {
  const [mode, setMode] = useState<HeroMode>('editorial');
  const isBold = mode === 'brutalism';

  return (
    <section className="hero" aria-label="Introduction" data-home-hero>
      <div
        className={`hero__panel hero__panel--editorial${isBold ? '' : ' is-active'}`}
        data-mode-panel="editorial"
      >
        <div className="hero__editorial">
          <div className="hero__background" aria-hidden="true" />

          <div className="hero__figure hero__figure--editorial" aria-hidden="true">
            <Silhouette className="hero__silhouette" />
          </div>

          <p className="hero__eyebrow">Software Engineer · Creative Technologist</p>

          <h1 className="hero__title">
            <span className="hero__word">
              <span className="hero__initial font-rox">S</span>
              <span className="hero__rest">olomon</span>
            </span>
            <span className="hero__word">
              <span className="hero__initial font-rox">M</span>
              <span className="hero__rest">wangi</span>
            </span>
          </h1>

          <div className="hero__intro">
            <div className="hero__reveal-mask">
              <p className="hero__description">
                Software engineer &amp; creative technologist
                <br />
                trying to make good things for the web.
              </p>
            </div>
            <div className="hero__reveal-mask">
              <p className="hero__description">
                Based in Nairobi, Kenya,
                <br />
                working with clients worldwide.
              </p>
            </div>
          </div>

          <div className="hero__origin">
            <div className="hero__reveal-mask">
              <span className="hero__origin-text">From Kenya with code.</span>
            </div>
          </div>

          <div className="hero__cta">
            <span className="hero__reveal-mask">
              <Link href="#work" className="hero__cta-label">
                <span className="hero__cta-label-track">
                  <span>View Work</span>
                  <span>View Work</span>
                </span>
              </Link>
            </span>
            <span className="hero__reveal-mask">
              <a href="mailto:solomon@example.com" className="hero__cta-label">
                <span className="hero__cta-label-track">
                  <span>solomon@example.com</span>
                  <span>solomon@example.com</span>
                </span>
              </a>
            </span>
            <span className="hero__reveal-mask">
              <a
                href="https://github.com/Losomon"
                target="_blank"
                rel="noreferrer"
                className="hero__cta-label"
              >
                <span className="hero__cta-label-track">
                  <span>GitHub</span>
                  <span>GitHub</span>
                </span>
              </a>
            </span>
          </div>
        </div>
      </div>

      <div
        className={`hero__panel hero__panel--brutalism${isBold ? ' is-active' : ''}`}
        data-mode-panel="brutalism"
      >
        <div className="hero__brutal">
          <div className="hero__brutal-background" aria-hidden="true" />

          <div className="hero__brutal-top">
            <span className="hero__brutal-kicker">Portfolio / Vol.2</span>
            <span className="hero__brutal-kicker">Nairobi, KE</span>
          </div>

          <div className="hero__brutal-center">
            <Silhouette className="hero__silhouette hero__silhouette--brutal" />
            <h2 className="hero__brutal-name">
              Solomon
              <span>Mwangi</span>
            </h2>
          </div>

          <div className="hero__brutal-info">
            <p className="hero__brutal-desc">
              Just a designer &amp; developer trying
              <br />
              to make good things for the web.
            </p>
            <p className="hero__brutal-loc">
              Based in Nairobi, Kenya,
              <br />
              working with clients worldwide.
            </p>

            <div className="hero__brutal-actions">
              <Link href="#contact" className="hero__brutal-cta">
                Let&apos;s Work Together!
              </Link>
              <a href="mailto:solomon@example.com" className="hero__brutal-link">
                solomon@example.com
              </a>
              <a href="tel:+254700000000" className="hero__brutal-link">
                +254 700 000 000
              </a>
              <a
                href="https://github.com/Losomon"
                target="_blank"
                rel="noreferrer"
                className="hero__brutal-link"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="hero__brutal-development" aria-hidden="true">
            Development
          </div>
        </div>
      </div>

      <div className="hero__mode">
        <span className="hero__mode-label">Layout:</span>
        <button
          type="button"
          className="hero__mode-switch"
          aria-label="Switch between editorial and brutalism layout"
          aria-pressed={isBold}
          onClick={() => setMode((value) => (value === 'editorial' ? 'brutalism' : 'editorial'))}
        >
          <span className={`hero__mode-option${isBold ? '' : ' is-active'}`} data-mode="editorial">
            Fine
          </span>
          <span className="hero__mode-divider" aria-hidden="true">
            /
          </span>
          <span className={`hero__mode-option${isBold ? ' is-active' : ''}`} data-mode="brutalism">
            Bold
          </span>
        </button>
      </div>
    </section>
  );
}