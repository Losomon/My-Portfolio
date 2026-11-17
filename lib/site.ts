const DEFAULT_SITE_URL = 'https://solointech.co.ke';

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteUrl = normalizeUrl(
  configuredUrl && configuredUrl.trim().length > 0 ? configuredUrl : DEFAULT_SITE_URL,
);

export const siteConfig = {
  name: 'Solomon Mwangi',
  legalName: 'Solomon Mwangi',
  role: 'Software Engineer & Full-Stack Developer',
  jobTitle: 'Software Engineer & Full-Stack Developer',
  defaultTitle: 'Solomon Mwangi — Software Engineer & Full-Stack Developer',
  description:
    'Solomon Mwangi is a software engineer and full-stack developer based in Nairobi, Kenya, building fast, accessible web applications with Next.js, TypeScript, and React.',
  shortDescription:
    'Software engineer and full-stack developer in Nairobi, Kenya, building web applications with Next.js, TypeScript, and React.',
  locale: 'en_KE',
  language: 'en',
  country: 'KE',
  city: 'Nairobi',
  email: 'solomboni5@gmail.com',
  phone: '0794152041',
  url: siteUrl,
  keywords: [
    'Solomon Mwangi',
    'Software Engineer Kenya',
    'Full-Stack Developer Nairobi',
    'Next.js Developer Kenya',
    'React Developer Nairobi',
    'TypeScript Engineer',
    'Frontend Developer Kenya',
    'Backend Developer Kenya',
    'Creative Developer',
    'Web Application Development',
  ],
  social: {
    github: 'https://github.com/Losomon',
    linkedin: 'https://www.linkedin.com/in/losomon22/',
  },
  stack: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Tailwind CSS',
    'GSAP',
    'Three.js',
  ],
} as const;

export function absoluteUrl(path: string): string {
  if (path === '/' || path.length === 0) return `${siteUrl}/`;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function siteHost(): string {
  return new URL(siteUrl).host;
}