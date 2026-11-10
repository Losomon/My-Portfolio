'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link href="#top" className="wordmark">SOLOMON<span>®</span></Link>
        <p>Built with care, and a little curiosity.</p>
        <span>© 2026 Solomon</span>
      </div>
    </footer>
  );
}