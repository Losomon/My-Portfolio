import Link from 'next/link';

const roles = ['Engineer', 'Problem Solver', 'Creative Thinker', 'Lifelong Learner'];

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="content-wrap about-shell">
        <div className="about-image">
          <div className="portrait-frame">
            <span className="portrait-badge">Based in Ho Chi Minh City</span>
          </div>
        </div>

        <div className="about-copy">
          <p className="eye-label">About Me</p>
          <h2 className="about-heading">
            The person
            <span>behind the code.</span>
          </h2>
          <p className="about-text">
            I’m a web designer based in Ho Chi Minh City, Vietnam, with a passion for building useful, human-centered digital experiences. I enjoy turning ideas into products that feel clear, practical and memorable.
          </p>

          <div className="about-meta">
            <ul className="about-role-list">
              {roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
            <Link href="#contact" className="inline-link">
              Learn More
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}