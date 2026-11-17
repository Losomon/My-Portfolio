'use client';

import dynamic from 'next/dynamic';

const ContactStage = dynamic(() => import('@/components/contact/ContactStage'), {
  ssr: false,
  loading: () => <section className="ch" aria-hidden="true" />,
});

export default function ContactStageWrapper() {
  return <ContactStage />;
}