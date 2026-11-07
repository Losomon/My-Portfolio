import Hero from '@/components/sections/Hero';
import CreativeStatement from '@/components/sections/CreativeStatement';
import Capabilities from '@/components/sections/Capabilities';
import Projects from '@/components/sections/Projects';

export default function Home() {
  return (
    <main>
      <Hero />
      <CreativeStatement />
      <Capabilities />
      <Projects />
    </main>
  );
}
