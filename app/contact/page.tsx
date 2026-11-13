import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="contact-page">
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="content-wrap">
            <div className="contact-hero__content">
<h1 id="contact-title" className="contact-hero__title">
                  <span className="contact-hero__title-mask">
                    <span className="contact-hero__title-line">
                      <span className="font-rox">C</span>ontact
                    </span>
                  </span>
                  <span className="contact-hero__title-mask">
                    <span className="contact-hero__title-line">
                      <span className="font-rox">L</span>et&apos;s Build Together
                    </span>
                  </span>
                </h1>
                <div className="contact-hero__meta">
                  <p className="contact-hero__description">
                    <span className="contact-hero__line-mask text-reveal-mask">
                      <span className="contact-hero__description-line">Have a project in mind?</span>
                    </span>
                    <span className="contact-hero__line-mask text-reveal-mask">
                      <span className="contact-hero__description-line">Let&apos;s talk about bringing it to life.</span>
                    </span>
                  </p>
                </div>
            </div>
          </div>
        </section>

        <section className="contact-content">
          <div className="content-wrap">
            <div className="contact-grid">
              <div className="contact-info">
                <div className="journey-box">
                  <p className="eyebrow eyebrow-light">My Journey</p>
                  <h2 className="journey-title">
                    A path of
                    <span>learning and creation.</span>
                  </h2>
                  <ul className="journey-list">
                    <li><span>Kenyatta University</span><small>BSc. Computer Science</small></li>
                    <li><span>Industrial Attachment</span><small>Software engineering practice</small></li>
                    <li><span>Building Real Solutions</span><small>Product design and implementation</small></li>
                  </ul>
                </div>
              </div>
              <div className="contact-form-wrapper">
                <div className="cta-box">
                  <h2>
                    Let&apos;s build something
                    <span>great together.</span>
                  </h2>
                  <form className="contact-form" action="https://formspree.io/f/hello@douglus.co" method="POST">
                    <div className="form-row">
                      <label htmlFor="name">Name</label>
                      <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-row">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-row">
                      <label htmlFor="message">Message</label>
                      <textarea id="message" name="message" rows={5} required></textarea>
                    </div>
                    <button type="submit" className="submit-button">
                      <span>Send Message</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </form>
                  <div className="social-row">
                    <a href="https://github.com/Losomon" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a>
                    <a href="mailto:hello@douglus.co" aria-label="Email">✉</a>
                  </div>
                  <p>© 2026 Douglus Nguyen. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}