'use client';

import dynamic from 'next/dynamic';

const AboutMotion = dynamic(() => import('@/components/about/AboutMotion'), {
  ssr: false,
  loading: () => null,
});

export default function AboutMotionWrapper() {
  return <AboutMotion />;
}