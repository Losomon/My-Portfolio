'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Silhouette from '@/components/ui/Silhouette';

type HeroMode = 'editorial' | 'brutalism';

const WEB_PATH =
  'M0 -6.67572e-06H36L54.4 97H54.8L77 -6.67572e-06H111L133.2 97H133.6L152 -6.67572e-06H188L151.6 143H115.6L94.2 53.8H93.8L72.4 143H36.4L0 -6.67572e-06ZM227.886 54.8H290.286V84.2H227.886V113.6H301.486V143H191.886V-6.67572e-06H300.286V29.4H227.886V54.8ZM426.272 36C426.272 53.6 415.872 62.4 404.072 66.4V66.8C419.072 69.4 431.872 79.4 431.872 100.8C431.872 131.2 412.472 143 382.872 143H311.472V-6.67572e-06H380.872C410.672 -6.67572e-06 426.272 11.6 426.272 36ZM347.472 57.8H372.272C382.272 57.8 390.272 55.4 390.272 43.6C390.272 31.8 382.272 29.4 372.272 29.4H347.472V57.8ZM347.472 79.8V113.6H373.272C388.272 113.6 395.872 110 395.872 96.6C395.872 83.2 388.272 79.8 373.272 79.8H347.472Z';

const DESIGN_PATH =
  'M0.000195801 146.2V3.20019H63.4002C103.2 3.20019 127.2 28.8002 127.2 74.8002C127.2 120.8 105.2 146.2 65.4002 146.2H0.000195801ZM36.0002 32.6002V116.8H59.8002C82.2002 116.8 91.2002 100.8 91.2002 74.8002C91.2002 48.8002 82.2002 32.6002 59.8002 32.6002H36.0002ZM171.016 58.0002H233.416V87.4002H171.016V116.8H244.616V146.2H135.016V3.20019H243.416V32.6002H171.016V58.0002ZM313.825 57.4002C340.825 64.8002 368.625 73.6002 368.625 104.2C368.625 131.6 347.825 149.4 312.025 149.4C274.825 149.4 246.825 131 246.825 99.2002H282.825C282.825 114.4 296.025 120 312.025 120C325.425 120 332.625 114.8 332.625 107.6C332.625 96.2002 317.225 93.6002 297.025 87.6002C272.425 80.4002 250.825 69.8002 250.825 43.4002C250.825 12.2002 275.225 0.000194073 306.025 0.000194073C339.425 0.000194073 365.625 17.6002 366.625 46.6002H330.625C329.025 35.8002 319.825 29.4002 306.025 29.4002C295.225 29.4002 286.825 32.8002 286.825 40.8002C286.825 49.6002 295.825 52.4002 313.825 57.4002ZM377.317 3.20019H413.317V146.2H377.317V3.20019ZM519.953 50.6002C517.353 40.8002 510.753 29.4002 490.953 29.4002C467.353 29.4002 458.353 47.8002 458.353 74.6002C458.353 101.6 467.353 120 492.353 120C508.953 120 520.553 110 520.953 96.2002H493.753V70.2002H558.153V146.2H532.353L528.753 128H528.353C521.553 141 508.153 149.4 487.153 149.4C446.553 149.4 422.353 117.8 422.353 74.6002C422.353 31.6002 446.553 0.000194073 491.553 0.000194073C530.753 0.000194073 552.553 23.2002 555.953 50.6002H519.953ZM569.414 146.2V3.20019H605.414L655.414 88.2002H655.814V3.20019H691.814V146.2H655.814L605.814 61.2002H605.414V146.2H569.414Z';

const DEVELOPMENT_PATH =
  'M233.8 154V11H297.2C337 11 361 36.6 361 82.6C361 128.6 339 154 299.2 154H233.8ZM269.8 40.4V124.6H293.6C316 124.6 325 108.6 325 82.6C325 56.6 316 40.4 293.6 40.4H269.8ZM404.816 65.8H467.216V95.2H404.816V124.6H478.416V154H368.816V11H477.216V40.4H404.816V65.8ZM478.202 11H516.402L543.402 111.2H543.802L571.002 11H609.002L562.602 154H524.602L478.202 11ZM648.675 65.8H711.075V95.2H648.675V124.6H722.275V154H612.675V11H721.075V40.4H648.675V65.8ZM732.261 11H768.261V124.6H831.861V154H732.261V11ZM899.269 157.2C853.869 157.2 828.469 125.6 828.469 82.4C828.469 39.4 853.869 7.8 899.269 7.8C944.269 7.8 970.069 39.4 970.069 82.4C970.069 125.6 944.269 157.2 899.269 157.2ZM899.269 127.8C925.269 127.8 934.069 107.4 934.069 82.4C934.069 57.6 925.269 37.2 899.269 37.2C873.069 37.2 864.469 57.6 864.469 82.4C864.469 107.4 873.069 127.8 899.269 127.8ZM977.878 154V11H1047.28C1077.08 11 1095.68 26.6 1095.68 56.6C1095.68 86.6 1077.08 102.2 1047.28 102.2H1013.88V154H977.878ZM1013.88 40.4V72.8H1039.68C1052.08 72.8 1059.68 68.6 1059.68 56.6C1059.68 44.6 1052.08 40.4 1039.68 40.4H1013.88ZM1102.35 154V11H1146.35L1175.75 102.2H1176.15L1205.55 11H1249.55V154H1215.55V65H1215.15L1188.55 154H1163.35L1136.75 65H1136.35V154H1102.35ZM1299.14 65.8H1361.54V95.2H1299.14V124.6H1372.74V154H1263.14V11H1371.54V40.4H1299.14V65.8ZM1382.73 154V11H1418.73L1468.73 96H1469.13V11H1505.13V154H1469.13L1419.13 69H1418.73V154H1382.73ZM1550.99 154V40.4H1509.39V11H1628.39V40.4H1586.99V154H1550.99Z';

export default function Hero() {
  const [mode, setMode] = useState<HeroMode>('editorial');
  const isBold = mode === 'brutalism';

  return (
    <section className={`home-hero${isBold ? ' is-brutalism' : ''}`} aria-label="Introduction" data-home-hero>
      <div className="home-hero__panel home-hero__panel--editorial" data-editorial-panel>
        <div className="home-hero__fluid" data-home-fluid aria-hidden="true">
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
                Just a designer &amp; developer trying
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
                  <a
                    href="https://github.com/Losomon"
                    target="_blank"
                    rel="noreferrer"
                    className="home-hero__cta-label"
                  >
                    <span className="home-hero__cta-label-mask">
                      <span className="home-hero__cta-label-track">
                        <span>GitHub</span>
                        <span>GitHub</span>
                      </span>
                    </span>
                  </a>
                </span>
              </div>
        </div>
      </div>

      <div className="home-hero__panel home-hero__panel--brutalism" data-brutalism-panel>
        <div className="home-hero__brutalism" data-brutalism-layout>
          <div className="home-hero__brutal-top">
            <div className="home-hero__brutal-web">
              <svg
                width="432"
                height="143"
                viewBox="0 0 432 143"
                fill="none"
                className="home-hero__brutal-text home-hero__brutal-text--web"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d={WEB_PATH} fill="#fefff8" />
              </svg>
            </div>

            <div className="home-hero__brutal-design-group">
              <svg
                width="692"
                height="150"
                viewBox="0 0 692 150"
                fill="none"
                className="home-hero__brutal-text home-hero__brutal-text--design"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d={DESIGN_PATH} fill="#fefff8" />
              </svg>

              <div className="home-hero__brutal-info">
                <p className="home-hero__brutal-name">Douglus Nguyen</p>
                <p className="home-hero__brutal-description">
                  Just a designer &amp; developer trying
                  <br />
                  to make good things for the web.
                </p>
                <p className="home-hero__brutal-location">
                  Based in Ho Chi Minh City, Viet Nam,
                  <br />
                  working with clients worldwide.
                </p>

                <div className="home-hero__brutal-actions">
                  <span className="home-hero__brutal-origin">From Vietnam with Love</span>
                  <Link href="#contact" className="home-hero__brutal-cta">
                    <strong>Let&apos;s Work Together!</strong>
                  </Link>
                  <div className="home-hero__brutal-email">
                    <a href="mailto:hello@douglus.co">hello@douglus.co</a>
                  </div>
                  <a href="tel:+84393277584" className="home-hero__brutal-link">
                    +84 393 277 584
                  </a>
                  <a
                    href="https://www.linkedin.com/in/douglus-nguyen-a48961265"
                    target="_blank"
                    rel="noreferrer"
                    className="home-hero__brutal-link"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="home-hero__figure home-hero__figure--brutalism" aria-hidden="true">
            <Silhouette className="home-hero__silhouette" />
          </div>

          <div className="home-hero__brutal-development">
            <svg
              width="1632"
              height="160"
              viewBox="0 0 1632 160"
              fill="none"
              className="home-hero__brutal-text home-hero__brutal-text--development"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M0 90H224" stroke="#fefff8" strokeWidth="20" />
              <path d={DEVELOPMENT_PATH} fill="#fefff8" />
            </svg>
          </div>
        </div>
      </div>

      <div className="home-hero__mode-control">
        <span className="home-hero__mode-label">Layout:</span>
        <button
          type="button"
          className="home-hero__mode-switch"
          aria-label="Switch between editorial and brutalism layout"
          aria-pressed={isBold}
          onClick={() => setMode((value) => (value === 'editorial' ? 'brutalism' : 'editorial'))}
          data-mode-switch
        >
          <span className={`home-hero__mode editorial${isBold ? '' : ' is-active'}`} data-mode="editorial">
            Fine
          </span>
          <span className="home-hero__mode-divider" aria-hidden="true">
            /
          </span>
          <span className={`home-hero__mode brutalism${isBold ? ' is-active' : ''}`} data-mode="brutalism">
            Bold
          </span>
        </button>
      </div>
    </section>
  );
}