'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import DigitalLibraryScene from './DigitalLibraryScene';

const SESSION_KEY = 'solomon-library-session-entered';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSessionSnapshot() {
  if (typeof window === 'undefined') return true;
  return window.sessionStorage.getItem(SESSION_KEY) === 'true';
}

function getServerSnapshot() {
  return true;
}

export default function Entrance() {
  const sessionEntered = useSyncExternalStore(subscribe, getSessionSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDismissed(true);
    }
  }, []);

  // Listen for manual re-opening from the navigation header
  useEffect(() => {
    const handleReopen = () => {
      setDismissed(false);
      setExiting(false);
    };

    window.addEventListener('open-library-entrance', handleReopen);
    return () => window.removeEventListener('open-library-entrance', handleReopen);
  }, []);

  // Normal 2.4s cinematic transition on click
  const handleCinematicEnter = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
    }
    setExiting(true);
    // 2.4 seconds transition matching the GSAP camera dive into the golden light
    window.setTimeout(() => {
      setDismissed(true);
      window.dispatchEvent(new CustomEvent('portfolio-entered'));
    }, 2400);
  }, []);

  // Immediate Skip Intro (Section D): No waiting, immediately transition to homepage
  const handleSkipImmediately = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
    }
    setExiting(true);
    // Immediate quick fade (180ms) directly to portfolio
    window.setTimeout(() => {
      setDismissed(true);
      window.dispatchEvent(new CustomEvent('portfolio-entered'));
    }, 180);
  }, []);

  // Do not render if not yet mounted (prevents hydration mismatch) or if already dismissed / entered in this session
  if (!mounted || sessionEntered || dismissed) return null;

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
