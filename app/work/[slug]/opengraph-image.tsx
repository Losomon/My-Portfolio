import { projects } from '@/lib/projects';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/components/og/OgCard';
import { renderOgImage } from '@/components/og/renderOgImage';
import { siteHost } from '@/lib/site';

export const alt = 'Solomon Mwangi — software engineering case study';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type ImageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return renderOgImage({
      eyebrow: 'CASE STUDY',
      title: 'Case Study',
      subtitle: 'A software engineering project by Solomon Mwangi.',
      footerLeft: siteHost(),
      footerRight: 'NAIROBI, KENYA',
    });
  }

  return renderOgImage({
    eyebrow: project.category.toUpperCase(),
    title: project.title,
    subtitle: project.description,
    footerLeft: `ROLE · ${project.role.toUpperCase()}`,
    footerRight: siteHost(),
  });
}