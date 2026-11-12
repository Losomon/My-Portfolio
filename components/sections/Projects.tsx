const projects = [
  { name: 'Stockly', kind: 'Inventory Management', tone: 'rose', accent: 'violet' },
  { name: 'Tawas Cosmetic', kind: 'E-commerce Experience', tone: 'blush', accent: 'peach' },
  { name: 'TravelGo', kind: 'Travel Platform', tone: 'grey', accent: 'charcoal' },
  { name: 'LOXORA SYSTEMS', kind: 'Enterprise Interface', tone: 'midnight', accent: 'silver' },
];

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
            <article key={project.name} className={`project-card project-${project.tone}`}>
              <div className="project-card-visual" aria-hidden="true">
                <span className="visual-badge">{project.kind}</span>
                <div className="visual-pattern" />
              </div>
              <div className="project-card-copy">
                <span className="project-kind">{project.kind}</span>
                <h3>{project.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
