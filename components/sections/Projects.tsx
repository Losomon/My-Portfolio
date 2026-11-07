import { projects } from '@/lib/projects';
import ProjectShowcase from '@/components/ui/ProjectShowcase';

export default function Projects() {
  return (
    <section id="work" className="section-dark py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 md:mb-32">
          <h2 className="font-['Times_New_Roman'] text-[var(--text-3xl)] md:text-7xl text-[var(--color-warm-cream)] leading-[1.05]">
            Selected <br/> Work.
          </h2>
          <p className="text-[var(--color-lavender)]/70 max-w-sm mt-6 md:mt-0 text-lg">
            A collection of software systems and digital products I've engineered, from initial concept to deployment.
          </p>
        </div>

        <div>
          {projects.map((project, index) => (
            <ProjectShowcase key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
