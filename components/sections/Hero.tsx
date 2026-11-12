import Link from 'next/link';

export default function Hero() {
  return (
    <section className="universe-hero" aria-label="Introduction">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-amber">
            SOFTWARE ENGINEER <span>·</span> CREATIVE TECHNOLOGIST
          </p>

          <h1 className="hero-title">
            Solomon
            <span>Mwangi.</span>
          </h1>

          <p className="hero-subtitle">
            <strong>THE DIGITAL UNIVERSE</strong> — Engineering digital experiences where architecture,
            code, and imagination converge.
          </p>

          <div className="hero-actions">
            <Link href="#about" className="primary-button">
              Enter Universe
              <span aria-hidden="true">→</span>
            </Link>
            <button type="button" className="secondary-button">
              Quick Jump [⌘K]
            </button>
          </div>

          <div className="stats-row" aria-label="Key portfolio stats">
            <div>
              <strong>07</strong>
              <span>Interactive Worlds</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Curated Exhibits</span>
            </div>
            <div>
              <strong>254</strong>
              <span>Nairobi / Kirinyaga</span>
            </div>
          </div>
        </div>

        <div className="hero-portal" aria-hidden="true">
          <div className="portal-ring ring-one" />
          <div className="portal-ring ring-two" />

          <div className="portal-arch">
            <div className="portal-core" />
            <div className="portal-pillar portal-pillar-left" />
            <div className="portal-pillar portal-pillar-right" />

            <svg viewBox="0 0 240 300" className="portal-figure" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="silhouetteGrad" x1="120" y1="40" x2="120" y2="300" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1A1511" />
                  <stop offset="45%" stopColor="#0C0A09" />
                  <stop offset="100%" stopColor="#080706" />
                </linearGradient>
                <linearGradient id="rimLight" x1="120" y1="35" x2="120" y2="260" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F5C77E" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#D4A359" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#D4A359" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M120 46C105 46 95 57 95 73C95 86 101 96 108 102C84 109 62 128 54 162L36 300H204L186 162C178 128 156 109 132 102C139 96 145 86 145 73C145 57 135 46 120 46Z" fill="url(#silhouetteGrad)" stroke="url(#rimLight)" strokeWidth="1.5" />
              <path d="M114 152L120 164L126 152M116 158H124" stroke="#D4A359" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            <div className="portal-floor" />
          </div>

          <button type="button" className="portal-tag">
            <span className="portal-dot" />
            PORTAL 01 // ACTIVE
          </button>
        </div>
      </div>
    </section>
  );
}
