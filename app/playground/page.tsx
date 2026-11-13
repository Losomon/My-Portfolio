import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function PlaygroundPage() {
  return (
    <>
      <Navigation />
      <main className="playground-page">
        <section className="playground-hero" aria-labelledby="playground-title">
          <div className="content-wrap">
            <h1 id="playground-title" className="playground-title">
              <span>Playground</span>
              <span>Experiments</span>
            </h1>
            <p className="playground-description">
              A space for experiments, prototypes, and playful interactions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
