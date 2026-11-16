import type { Metadata } from 'next';
import { seoMetadata } from '@/lib/seo';

export const metadata: Metadata = seoMetadata({
  title: 'Selected Work — Software Engineering Case Studies',
  description:
    'Full-stack engineering work by Solomon Mwangi: inventory systems, analytics dashboards, and production web applications built with Next.js, TypeScript, and PostgreSQL.',
  path: '/work',
});

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}