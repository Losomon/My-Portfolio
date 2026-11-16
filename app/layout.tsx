import type { Metadata, Viewport } from 'next';
import './globals.css';
import JsonLd from '@/components/seo/JsonLd';
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/seo';
import { absoluteUrl, siteConfig, siteUrl } from '@/lib/site';

const homeTitle = siteConfig.defaultTitle;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: absoluteUrl('/') }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    title: homeTitle,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: '/opengraph-image',
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `${siteConfig.name} — ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: siteConfig.description,
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  referrer: 'strict-origin-when-cross-origin',
};

export const viewport: Viewport = {
  themeColor: '#1e1e1e',
  width: 'device-width',
  initialScale: 1,
};

const personStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: siteConfig.name,
  url: absoluteUrl('/'),
  jobTitle: siteConfig.jobTitle,
  description: siteConfig.shortDescription,
  email: `mailto:${siteConfig.email}`,
  telephone: siteConfig.phone,
  knowsAbout: siteConfig.stack,
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteConfig.city,
    addressCountry: siteConfig.country,
  },
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: siteConfig.name,
  url: absoluteUrl('/'),
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  about: { '@id': `${siteUrl}/#person` },
  publisher: { '@id': `${siteUrl}/#person` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language}>
      <body>
        <JsonLd data={[personStructuredData, websiteStructuredData]} />
        {children}
      </body>
    </html>
  );
}