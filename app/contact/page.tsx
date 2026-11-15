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
                    <span className="font-rox">L</span>et&apos;s create work that matters
                  </span>
                </span>
                <span className="contact-hero__title-mask">
                  <span className="contact-hero__title-line">
                    Have an idea?
                  </span>
                </span>
                <span className="contact-hero__title-mask">
                  <span className="contact-hero__title-line">
                    Let&apos;s talk about it.
                  </span>
                </span>
              </h1>
            </div>
          </div>
        </section>

        <section className="contact-content">
          <div className="content-wrap">
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-details">
                  <div className="contact-detail">
                    <span className="contact-detail-label">Email</span>
                    <a href="mailto:solomboni5@gmail.com" className="contact-detail-value">
                      solomboni5@gmail.com
                    </a>
                  </div>
                  <div className="contact-detail">
                    <span className="contact-detail-label">Phone</span>
                    <a href="tel:0794152041" className="contact-detail-value">
                      0794152041
                    </a>
                  </div>
                  <div className="contact-detail">
                    <span className="contact-detail-label">Social</span>
                    <a
                      href="https://www.linkedin.com/in/losomon22/"
                      target="_blank"
                      rel="noreferrer"
                      className="contact-detail-value"
                    >
                      LinkedIn
                    </a>
                  </div>
                  <div className="contact-detail">
                    <span className="contact-detail-label">Local time</span>
                    <span className="contact-detail-value" data-local-time>--:-- GMT+3</span>
                  </div>
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
