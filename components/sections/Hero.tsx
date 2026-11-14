'use client';

import Image from 'next/image';
import Link from 'next/link';
import Silhouette from '@/components/ui/Silhouette';
import FluidBackground from '@/components/ui/FluidBackground';

export default function Hero() {
  return (
    <section className="home-hero" aria-label="Introduction" data-home-hero>
      <div className="home-hero__panel home-hero__panel--editorial" data-editorial-panel>
        <div className="home-hero__fluid" data-home-fluid aria-hidden="true">
          <FluidBackground className="home-hero__ink-canvas" />
          <Image
            className="home-hero__ink-poster"
            src="/images/bg_.webp"
            alt=""
            width={2048}
            height={1322}
            priority
          />
        </div>
        <div className="home-hero__static-bg" aria-hidden="true">
          <Image src="/images/bg_.webp" alt="" width={2048} height={1322} priority />
        </div>
        <div className="home-hero__editorial" data-editorial-layout>
          <div className="home-hero__background" aria-hidden="true" />

          <div className="home-hero__figure home-hero__figure--editorial" aria-hidden="true">
            <Silhouette className="home-hero__silhouette" />
          </div>

          <h1 className="home-hero__title" data-editorial-title>
            <span className="home-hero__word home-hero__word--douglus">
              <span className="home-hero__initial-track">
                <span className="home-hero__initial-mask">
                  <span className="home-hero__initial font-rox">D</span>
                </span>
              </span>
              <span className="home-hero__rest-mask">
                <span className="home-hero__rest"> ouglus </span>
              </span>
            </span>
            <span className="home-hero__word home-hero__word--nguyen">
              <span className="home-hero__initial-track">
                <span className="home-hero__initial-mask">
                  <span className="home-hero__initial font-rox">N</span>
                </span>
              </span>
              <span className="home-hero__rest-mask">
                <span className="home-hero__rest"> guyen </span>
              </span>
            </span>
          </h1>

          <div className="home-hero__intro">
            <div className="home-hero__reveal-mask text-reveal-mask">
              <p className="home-hero__description">
                Just a designer & developer trying
                <br />
                to make good things for the web.
              </p>
            </div>
            <div className="home-hero__reveal-mask text-reveal-mask">
              <p className="home-hero__description">
                Based in Ho Chi Minh City, Vietnam,
                <br />
                working with clients worldwide.
              </p>
            </div>
          </div>

          <div className="home-hero__origin">
            <div className="home-hero__reveal-mask text-reveal-mask">
              <span className="home-hero__origin-text">From Vietnam with Love.</span>
            </div>
          </div>

          <div className="home-hero__cta">
            <span className="home-hero__reveal-mask text-reveal-mask">
              <a
                href="https://www.linkedin.com/in/douglus-nguyen-a48961265"
                target="_blank"
                rel="noreferrer"
                className="home-hero__cta-label"
              >
                <span className="home-hero__cta-label-mask">
                  <span className="home-hero__cta-label-track">
                    <span>LinkedIn</span>
                    <span>LinkedIn</span>
                  </span>
                </span>
              </a>
            </span>
            <span className="home-hero__reveal-mask text-reveal-mask">
              <a href="tel:+84393277584" className="home-hero__cta-label">
                <span className="home-hero__cta-label-mask">
                  <span className="home-hero__cta-label-track">
                    <span>+84 393 277 584</span>
                    <span>+84 393 277 584</span>
                  </span>
                </span>
              </a>
            </span>
            <span className="home-hero__reveal-mask text-reveal-mask">
              <a href="mailto:hello@douglus.co" className="home-hero__cta-label">
                <span className="home-hero__cta-label-mask">
                  <span className="home-hero__cta-label-track">
                    <span>hello@douglus.co</span>
                    <span>hello@douglus.co</span>
                  </span>
                </span>
              </a>
            </span>
            <span className="home-hero__reveal-mask text-reveal-mask">
              <Link href="#contact" className="home-hero__cta-label home-hero__cta-label--primary">
                <span className="home-hero__cta-label-mask">
                  <span className="home-hero__cta-label-track">
                    <span>Let&apos;s Work Together!</span>
                    <span>Let&apos;s Work Together!</span>
                  </span>
                </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}