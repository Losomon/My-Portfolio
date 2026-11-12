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
          className="site-header__menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`menu-icon${open ? ' is-open' : ''}`} aria-hidden="true">
            <span className="menu-icon__line menu-icon__line--1">
              <span className="menu-icon__line-in" />
            </span>
            <span className="menu-icon__line menu-icon__line--2">
              <span className="menu-icon__line-in" />
            </span>
            <span className="menu-icon__line menu-icon__line--x1">
              <span className="menu-icon__line-in" />
            </span>
            <span className="menu-icon__line menu-icon__line--x2">
              <span className="menu-icon__line-in" />
            </span>
          </span>

          <span className="menu-label">
            <span className="menu-label__state menu-label__state--menu">Menu</span>
            <span className="menu-label__state menu-label__state--close">Close</span>
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