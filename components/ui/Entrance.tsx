'use client';

import { useCallback, useEffect, useState } from 'react';
import DigitalLibraryScene from './DigitalLibraryScene';

export default function Entrance() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const handleReopen = () => {
      setDismissed(false);
      setExiting(false);
    };

    window.addEventListener('open-library-entrance', handleReopen);
    return () => window.removeEventListener('open-library-entrance', handleReopen);
  }, []);

  const enter = useCallback(() => {
    setExiting(true);
    // Allow the 2.4s GSAP camera dive and golden bloom to complete before unmounting
    window.setTimeout(() => {
      setDismissed(true);
      // Notify page that entrance has transitioned
      window.dispatchEvent(new CustomEvent('portfolio-entered'));
    }, 2400);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`digital-library-entrance-root${exiting ? ' is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="The Digital Library Entrance"
    >
      <DigitalLibraryScene onEnterPortfolio={enter} />
    </div>
  );
}
