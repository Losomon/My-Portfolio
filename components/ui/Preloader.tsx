'use client';

import { useEffect, useState } from 'react';
import Silhouette from './Silhouette';
import Soffit from './Soffit';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [renderArtwork, setRenderArtwork] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const duration = reduced ? 300 : 900;
    const start = performance.now();
    let exitTimer: number | null = null;
    let intervalId: number | null = null;

    const artTimer = window.setTimeout(() => {
      setRenderArtwork(true);
    }, reduced ? 0 : 250);

    const updateProgress = () => {
      const now = performance.now();
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t >= 1) {
        if (intervalId) window.clearInterval(intervalId);
        setLeaving(true);
        exitTimer = window.setTimeout(() => setHidden(true), reduced ? 50 : 500);
      }
    };

    intervalId = window.setInterval(updateProgress, 50);
    updateProgress();

    return () => {
      window.clearTimeout(artTimer);
      if (exitTimer) window.clearTimeout(exitTimer);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`preloader${leaving ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {renderArtwork && (
        <>
          <Soffit className="preloader__soffit" active={!leaving} />
          <div className="preloader__artwork" aria-hidden="true">
            <Silhouette />
          </div>
        </>
      )}

      <div className="preloader__content">
        <div className="preloader__title">
          <span className="preloader__title-mask">
            <span className="preloader__title-line">Hello, Welcome to my Portfolio</span>
          </span>
        </div>

        <div className="preloader__progress">
          <div className="preloader__track">
            <div className="preloader__bar" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <span className="preloader__percent">{progress}%</span>
        </div>
      </div>

      <div className="preloader__transition" aria-hidden="true">
        <div className="preloader__transition-band" />
      </div>
    </div>
  );
}