'use client';

import { useEffect, useState } from 'react';
import MenuOverlay, { type MenuLink } from './MenuOverlay';

const LINKS: MenuLink[] = [
  { href: '#top', label: 'Home', initial: 'H', words: ['Vision', 'Start', 'Everything'] },
  { href: '#work', label: 'Work', initial: 'W', words: ['Build', 'Create', 'Deliver'] },
  { href: '#about', label: 'About', initial: 'A', words: ['People', 'Story', 'Values'] },
  { href: '#contact', label: 'Contact', initial: 'C', words: ['Connect', 'Collab', 'Talk'] },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="site-header__availability">
          <span>Open for collaborations</span>
          <span>and new projects.</span>
        </div>

        <button
          type="button"
          className={`site-header__menu${open ? ' is-opened-navi' : ''}`}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
          data-menu-open
        >
          <span className="site-header__menu-icon" aria-hidden="true">
            <span className="site-header__menu-line site-header__menu-line--01">
              <span className="site-header__menu-line-in site-header__menu-line-in--01" />
            </span>
            <span className="site-header__menu-line site-header__menu-line--02">
              <span className="site-header__menu-line-in site-header__menu-line-in--02" />
            </span>
            <span className="site-header__menu-line site-header__menu-line--cross01">
              <span className="site-header__menu-line-in site-header__menu-line-in--cross01" />
            </span>
            <span className="site-header__menu-line site-header__menu-line--cross02">
              <span className="site-header__menu-line-in site-header__menu-line-in--cross02" />
            </span>
          </span>

          <span className="site-header__menu-label">
            <span className="site-header__menu-label-state site-header__menu-label-state--menu">
              <span className="site-header__menu-label-track">
                <span>Menu</span>
                <span>Menu</span>
              </span>
            </span>
            <span className="site-header__menu-label-state site-header__menu-label-state--close">
              <span className="site-header__menu-label-track">
                <span>Close</span>
                <span>Close</span>
              </span>
            </span>
          </span>
        </button>

        <p className="site-header__archive">Archive vol.2</p>
      </header>

      <MenuOverlay
        open={open}
        links={LINKS}
        activeIndex={activeIndex}
        onHover={setActiveIndex}
        onNavigate={() => setOpen(false)}
      />
    </>
  );
}