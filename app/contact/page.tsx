import { Metadata } from 'next';
import ContactStage from '@/components/contact/ContactStage';
import ContactForm from '@/components/contact/ContactForm';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Solomon Mwangi — Contact',
  description:
    'Have a project in mind? Get in touch with Solomon Mwangi to discuss collaborations and new ideas.',
};

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