'use client';

import { useCallback, useEffect, useState } from 'react';
import DigitalLibraryScene, { POI } from './DigitalLibraryScene';

export default function Entrance() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [activePoi, setActivePoi] = useState<POI['id']>('overview');

  useEffect(() => {
    const handleReopen = () => {
      setDismissed(false);
      setExiting(false);
      setActivePoi('overview');
    };

    window.addEventListener('open-library-entrance', handleReopen);
    return () => window.removeEventListener('open-library-entrance', handleReopen);
  }, []);

  const enter = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => setDismissed(true), 700);
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
        onEnterPortfolio={enter}
        activePoi={activePoi}
        setActivePoi={setActivePoi}
      />
    </div>
  );
}
