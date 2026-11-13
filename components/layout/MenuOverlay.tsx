'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface MenuLink {
  href: string;
  label: string;
  initial: string;
  words: string[];
  previewImage: string;
}

interface MenuOverlayProps {
  open: boolean;
  links: MenuLink[];
  activeIndex: number;
  onHover: (index: number) => void;
  onNavigate: () => void;
}

export default function MenuOverlay({
  open,
  links,
  activeIndex,
  onHover,
  onNavigate,
}: MenuOverlayProps) {
  return (
    <div
      id="site-menu"
      className={`menu-overlay${open ? ' is-open' : ''}`}
      aria-hidden={!open}
      data-menu
    >
      <div className="menu-overlay__inner">
        <div className="menu-overlay__stage" aria-hidden="true">
          <div className="menu-overlay__preview" data-menu-preview>
            {links.map((link, index) => (
              <div
                key={link.href}
                className={`menu-overlay__preview-item${index === activeIndex ? ' is-in' : ''}`}
                data-menu-preview-item={link.label.toLowerCase()}
              >
                <div className="menu-overlay__preview-media">
                  <span className="menu-overlay__preview-mask">
                    <Image
                      src={link.previewImage}
                      alt=""
                      width={1254}
                      height={1254}
                      className="menu-overlay__preview-image"
                    />
                  </span>
                  <div className="menu-overlay__preview-words">
                    {link.words.map((word) => (
                      <span key={word} className="menu-overlay__preview-word-mask">
                        <span className="menu-overlay__preview-word">{word}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="menu-overlay__panel">
          <nav className="menu-overlay__nav" aria-label="Main navigation">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`menu-overlay__link${index === activeIndex ? ' is-active' : ''}`}
                aria-current={index === activeIndex ? 'page' : undefined}
                onMouseEnter={() => onHover(index)}
                onFocus={() => onHover(index)}
                onClick={onNavigate}
                data-menu-item={link.label.toLowerCase()}
              >
                <span className="menu-overlay__link-mask">
                  <span className="menu-overlay__link-text">
                    <span className="font-rox">{link.initial}</span>
                    {link.label.slice(1)}
                  </span>
                </span>
                <span className="menu-overlay__indicator" aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="menu-overlay__panel-footer">
            <div className="menu-overlay__contact">
              <a href="mailto:hello@douglus.co">hello@douglus.co</a>
              <a href="tel:+84393277584">+84 39 327 7584</a>
            </div>

            <div className="menu-overlay__socials">
              <a href="https://github.com/Losomon" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}