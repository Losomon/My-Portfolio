'use client';

import dynamic from 'next/dynamic';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';

const About = dynamic(() => import('@/components/sections/About'), {
  ssr: false,
  loading: () => <section id="about" className="about-section" aria-hidden="true" />,
});

const Projects = dynamic(() => import('@/components/sections/Projects'), {
  ssr: false,
  loading: () => <section id="work" className="projects-section" aria-hidden="true" />,
});

const Capabilities = dynamic(() => import('@/components/sections/Capabilities'), {
  ssr: false,
  loading: () => <section id="capabilities" className="capabilities-section" aria-hidden="true" />,
});

const Contact = dynamic(() => import('@/components/sections/Contact'), {
  ssr: false,
  loading: () => <section id="contact" className="contact-section" aria-hidden="true" />,
});

const Preloader = dynamic(() => import('@/components/ui/Preloader'), {
  ssr: false,
  loading: () => <div className="preloader" aria-hidden="true" />,
});

export default function Home() {
  return (
    <>
      <Preloader />
      <Navigation />
      <main id="top" className="site-shell">
        <Hero />
        <About />
        <Projects />
        <Capabilities />
        <Contact />
      </main>
      <Footer />
    </>
  );
}