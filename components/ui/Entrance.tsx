'use client';

import { useCallback, useEffect, useState } from 'react';
import DigitalLibraryScene from './DigitalLibraryScene';

export default function Entrance() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Listen for manual re-opening from the navigation header
  useEffect(() => {
    const handleReopen = () => {
      setDismissed(false);
      setExiting(false);
    };

    window.addEventListener('open-library-entrance', handleReopen);
    return () => window.removeEventListener('open-library-entrance', handleReopen);
  }, []);

  // 2.4s cinematic transition on click (Section C & E)
  const handleCinematicEnter = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => {
      setDismissed(true);
      window.dispatchEvent(new CustomEvent('portfolio-entered'));
    }, 2400);
  }, []);

  // Immediate Skip Intro (Section D): No waiting, immediate 200ms transition to homepage
  const handleSkipImmediately = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => {
      setDismissed(true);
      window.dispatchEvent(new CustomEvent('portfolio-entered'));
    }, 200);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`digital-library-entrance-root${exiting ? ' is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="The Digital Library Entrance"
    >
      <DigitalLibraryScene
        onEnterPortfolio={handleCinematicEnter}
        onSkipImmediately={handleSkipImmediately}
      />
    </div>
  );
}
