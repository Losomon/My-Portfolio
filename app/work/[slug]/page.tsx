import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();
  const cs = project.caseStudy;

  const sections: { title: string; body: string }[] = [
    { title: 'Overview', body: cs.overview },
    { title: 'Problem', body: cs.problem },
    { title: 'Target Users', body: cs.targetUsers },
    { title: 'Role', body: cs.role },
    { title: 'Design Direction', body: cs.designDirection },
    { title: 'Technical Architecture', body: cs.technicalArchitecture },
    { title: 'Implementation', body: cs.implementation },
    { title: 'Engineering Challenges', body: cs.engineeringChallenges },
    { title: 'Security & Performance', body: cs.securityAndPerformance },
    { title: 'Current Status', body: cs.currentStatus },
    { title: 'Lessons Learned', body: cs.lessonsLearned },
    { title: 'Next Improvements', body: cs.nextImprovements },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-warm-cream)] text-[var(--color-deep-plum)] py-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <h1 className="font-['Times_New_Roman'] text-[var(--text-4xl)] mb-4">{project.title}</h1>
        <p className="text-[var(--color-secondary-text)] text-lg mb-12">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-12">
          {cs.technologyChoices.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-xs border border-[var(--color-deep-plum)]/20">{t}</span>
          ))}
        </div>
        {cs.architectureDiagram && (
          <img src={cs.architectureDiagram} alt="Architecture diagram" className="w-full rounded-2xl mb-12" />
        )}
        {sections.map((s) => (
          <section key={s.title} className="mb-10">
            <h2 className="font-['Times_New_Roman'] text-[var(--text-3xl)] mb-3">{s.title}</h2>
            <p className="text-[var(--color-secondary-text)] leading-relaxed">{s.body}</p>
          </section>
        ))}
        {project.gallery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {project.gallery.map((g) => (
              <img key={g.src} src={g.src} alt={g.alt} className="w-full rounded-2xl" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
