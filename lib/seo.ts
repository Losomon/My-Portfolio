import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type SeoImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

const defaultImage: SeoImage = {
  url: '/opengraph-image',
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: `${siteConfig.name} — ${siteConfig.role}`,
};

type SeoInput = {
  title: string;
  description: string;
  path: string;
  images?: SeoImage[];
  type?: 'website' | 'article';
};

export function seoMetadata({ title, description, path, images, type = 'website' }: SeoInput): Metadata {
  const resolvedImages = images && images.length > 0 ? images : [defaultImage];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      title,
      description,
      locale: siteConfig.locale,
      images: resolvedImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resolvedImages.map((image) => ({
        url: image.url,
        alt: image.alt ?? `${title} — ${siteConfig.name}`,
      })),
    },
  };
}

export function caseStudyImage(slug: string): SeoImage {
  return {
    url: `/work/${slug}/opengraph-image`,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: `${siteConfig.name} — case study`,
  };
}