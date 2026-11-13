'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link href="#top" className="wordmark">DOUGLUS<span>NGUYEN</span></Link>
        <p>Web designer based in Ho Chi Minh City, Vietnam.</p>
        <span>© 2026 Douglus Nguyen</span>
      </div>
    </footer>
  );
}