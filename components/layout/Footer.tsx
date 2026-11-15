'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link href="#top" className="wordmark">SOLOMON<span>MWANGI</span></Link>
        <p>Web designer based in Nairobi, Kenya.</p>
        <span>© 2026 Solomon Mwangi</span>
      </div>
    </footer>
  );
}
