import type { MetadataRoute } from 'next';
import { projects } from '@/lib/projects';
import { absoluteUrl } from '@/lib/site';

// Resolved once at build time so `lastmod` stays stable between requests.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/work'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/about'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/playground'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}