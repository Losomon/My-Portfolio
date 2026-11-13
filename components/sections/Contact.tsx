export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="content-wrap contact-shell">
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

        <div className="cta-box">
          <h2>
            Let&apos;s build something
            <span>great together.</span>
          </h2>
          <div className="social-row">
            <a href="https://github.com/Losomon" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a>
            <a href="mailto:hello@douglus.co" aria-label="Email">✉</a>
          </div>
          <p>© 2026 Douglus Nguyen. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
