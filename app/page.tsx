import Hero from '@/components/sections/Hero';
import CreativeStatement from '@/components/sections/CreativeStatement';
import Capabilities from '@/components/sections/Capabilities';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Entrance from '@/components/ui/Entrance';

export default function Home() {
  return (
    <>
      <Entrance />
      <Navigation />
      <main id="top">
        <Hero />
        <CreativeStatement />
        <Projects />
        <Capabilities />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
