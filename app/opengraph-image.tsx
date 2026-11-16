import { OG_CONTENT_TYPE, OG_SIZE } from '@/components/og/OgCard';
import { renderOgImage } from '@/components/og/renderOgImage';
import { siteConfig, siteHost } from '@/lib/site';

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: 'PORTFOLIO',
    title: siteConfig.name,
    subtitle: 'Software Engineer & Full-Stack Developer building fast, accessible products for the web.',
    footerLeft: 'NEXT.JS · TYPESCRIPT · REACT · NODE.JS',
    footerRight: siteHost(),
  });
}