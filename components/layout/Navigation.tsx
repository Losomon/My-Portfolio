'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="#top" className="wordmark" aria-label="Solomon, back to top">
          SOLOMON<span>®</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="primary-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="text-link text-link-light"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
            onClick={() => {
              setMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-library-entrance'));
            }}
          >
            🏛️ 3D Library
          </button>
          <span className="availability"><i aria-hidden="true" /> Building Stockly</span>
        </nav>
      </div>
    </header>
  );
}