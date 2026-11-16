import { Metadata } from 'next';
import ContactStage from '@/components/contact/ContactStage';
import ContactForm from '@/components/contact/ContactForm';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { seoMetadata } from '@/lib/seo';

export const metadata: Metadata = seoMetadata({
  title: 'Contact Solomon Mwangi — Software Engineer in Nairobi',
  description:
    'Get in touch with Solomon Mwangi, a software engineer and full-stack developer in Nairobi, Kenya, for freelance projects, collaborations, and full-time roles.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="contact-page" id="top">
        <ContactStage />
        <ContactForm />
        <div className="contact-transition-veil" aria-hidden="true" />
      </main>
      <Footer />
    </>
  );
}