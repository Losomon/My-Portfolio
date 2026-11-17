'use client';

import dynamic from 'next/dynamic';

const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  ssr: false,
  loading: () => <section className="contact-inquiry" aria-hidden="true" />,
});

export default function ContactFormWrapper() {
  return <ContactForm />;
}