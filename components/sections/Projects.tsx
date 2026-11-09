import { projects } from '@/lib/projects';
import ProjectShowcase from '@/components/ui/ProjectShowcase';

export default function Projects() {
  return (
    <section id="work" className="projects-section">
      <div className="content-wrap">
        <div className="projects-heading">
          <div>
            <p className="eyebrow">02 / Selected work</p>
            <h2 className="editorial-heading">Projects with<br /><em>a purpose.</em></h2>
          </div>
          <p className="projects-intro">
            A growing collection of digital products shaped by real needs, thoughtful design, and the details behind the interface.
          </p>
        </div>
        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectShowcase key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
