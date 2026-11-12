'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '#top', label: 'Home' },
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
          SM
        </Link>

        <nav id="primary-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="#work" onClick={() => setMenuOpen(false)}>
            Library
          </Link>
        </nav>

        <span className="availability"><i aria-hidden="true" /> Kenya</span>
      </div>
    </header>
  );
}
