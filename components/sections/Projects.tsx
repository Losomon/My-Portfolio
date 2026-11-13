import { projects } from '@/lib/projects';

export default function Projects() {
  return (
    <section id="work" className="projects-section">
      <div className="content-wrap">
        <div className="projects-head">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2 className="section-title">
              Projects that
              <span>bring ideas to life.</span>
            </h2>
          </div>
          <button type="button" className="view-button">
            View All Projects
          </button>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.slug} className={`project-card project-${project.slug}`}>
              <div className="project-card-visual" aria-hidden="true">
                <span className="visual-badge">{project.category}</span>
                <div className="visual-pattern" />
              </div>
              <div className="project-card-copy">
                <span className="project-kind">{project.category}</span>
                <h3>{project.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
