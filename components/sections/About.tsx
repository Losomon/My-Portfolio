import Link from 'next/link';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="content-wrap about-grid">
        <div className="section-index section-index-light">
          <span>03 / A little about me</span>
          <span className="about-mark" aria-hidden="true">S.</span>
        </div>
        <div className="about-copy">
          <h2 className="editorial-heading">
            Engineer by nature.
            <br />
            <em>Curious by default.</em>
          </h2>
          <div className="about-body">
            <p>
              I’m Solomon, a software engineer who enjoys turning complex needs into clear, useful digital products. I care about the whole experience: how a product feels to use, how it is built, and how it can keep getting better.
            </p>
            <p>
              My current work includes Stockly, a phone-first inventory tool for small businesses. It has me thinking about the details that matter most: reliable records, practical workflows, and interfaces that make everyday work easier.
            </p>
            <Link href="#contact" className="text-link">More about the work <span aria-hidden="true">↘</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}