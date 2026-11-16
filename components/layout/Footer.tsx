import Link from 'next/link';

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/playground', label: 'Playground' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Link href="/#top" className="wordmark">
              SOLOMON<span>MWANGI</span>
            </Link>
            <p className="site-footer-tagline">Software engineer &amp; full-stack developer based in Nairobi, Kenya.</p>
          </div>

          <nav className="site-footer-nav" aria-label="Footer">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="site-footer-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer-bottom">
          <span>© 2026 Solomon Mwangi</span>
          <span className="site-footer-credit">Designed &amp; built by Solomon Mwangi</span>
          <Link href="/#top" className="site-footer-top-link">
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}