import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/projects';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
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
    <>
      <Navigation />
      <main className="case-study">
        <div className="case-study-header">
          <div className="case-study-wrap">
            <Link href="/#work" className="case-study-back"><span aria-hidden="true">←</span> Back to selected work</Link>
            <p className="eyebrow">{project.category} <span>·</span> {project.status}</p>
            <h1>{project.title}<span>.</span></h1>
            <p className="case-study-description">{project.description}</p>
            <div className="case-study-tags">
              {cs.technologyChoices.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="case-study-wrap case-study-content">
          <div className="case-study-facts">
            <div><span>Role</span><strong>{project.role}</strong></div>
            <div><span>Current status</span><strong>{project.status}</strong></div>
            <div><span>Toolkit</span><strong>{project.stack.join(' · ')}</strong></div>
          </div>
          {sections.map((section, index) => (
            <section key={section.title} className="case-study-section">
              <span className="case-study-number">0{index + 1}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </div>
            </section>
          ))}
          <p className="case-study-status-note">{project.statusNote}</p>
          <Link href="/#work" className="text-link">Back to selected work <span aria-hidden="true">↗</span></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
