import type { Metadata } from 'next';
import { seoMetadata } from '@/lib/seo';

export const metadata: Metadata = seoMetadata({
  title: 'Playground — Creative Coding Experiments',
  description:
    'Experiments in creative coding, WebGL scenes, particle systems, and motion design by software engineer Solomon Mwangi.',
  path: '/playground',
});

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children;
}