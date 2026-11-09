'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSyncExternalStore } from 'react';

export default function Entrance() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hasEntered = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange);
      return () => window.removeEventListener('storage', onStoreChange);
    },
    () => window.localStorage.getItem('solomon-portfolio-entered') === 'true',
    () => true
  );

  const enter = useCallback(() => {
    window.localStorage.setItem('solomon-portfolio-entered', 'true');
    setExiting(true);
    window.setTimeout(() => setDismissed(true), 420);
  }, []);

  useEffect(() => {
    if (hasEntered) return;
    const timer = window.setTimeout(enter, 1050);
    return () => window.clearTimeout(timer);
  }, [enter, hasEntered]);

  if (hasEntered || dismissed) return null;

  return (
    <div className={`entrance${exiting ? ' entrance-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Portfolio introduction">
      <div className="entrance-top">
        <span>SOLOMON®</span>
        <span>Portfolio / 2026</span>
      </div>
      <div className="entrance-content">
        <p className="entrance-kicker">Software engineer · Creative technologist</p>
        <h1>A MOVIE<span>.</span></h1>
        <p className="entrance-subtitle">A little world of ideas, made tangible.</p>
        <div className="entrance-object" aria-hidden="true">
          <div className="entrance-object-glow" />
          <div className="entrance-orbit entrance-orbit-one" />
          <div className="entrance-orbit entrance-orbit-two" />
          <div className="entrance-shelf">
            <i /><i /><i /><i /><i />
            <span />
          </div>
        </div>
        <button className="entrance-button" type="button" onClick={enter}>
          Enter experience <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="entrance-bottom">
        <span>Loading the good stuff</span>
        <div className="entrance-progress" aria-hidden="true"><span /></div>
        <button type="button" onClick={enter} className="entrance-skip">Skip intro</button>
      </div>
    </div>
  );
}
