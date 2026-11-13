export interface CaseStudyContent {
  overview: string;
  problem: string;
  targetUsers: string;
  role: string;
  designDirection: string;
  technicalArchitecture: string;
  technologyChoices: string[];
  implementation: string;
  engineeringChallenges: string;
  securityAndPerformance: string;
  currentStatus: string;
  lessonsLearned: string;
  nextImprovements: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  role: string;
  description: string;
  stack: string[];
  status: 'Production' | 'Prototype' | 'In Development';
  statusNote: string;
  caseStudy: CaseStudyContent;
}

export const projects: Project[] = [
  {
    slug: 'vet-claim',
    title: 'VetClaim Advantage',
    category: 'Legal Technology',
    role: 'Design, Development',
    description: 'A VA disability law firm that needed to look as serious as the work they do.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    status: 'Production',
    statusNote: 'Case study coming soon.',
    caseStudy: {
      overview: 'VetClaim Advantage is a VA disability law firm that needed a digital presence as serious as the work they do. The project involved a complete brand redesign and website development.',
      problem: 'The firm had an outdated website that didn\'t convey the professionalism and trust required for veterans seeking disability benefits.',
      targetUsers: 'Veterans seeking VA disability benefits and legal representation.',
      role: 'Design, Development',
      designDirection: 'Clean, authoritative design with strong typography and a trustworthy color palette. The design prioritizes credibility and ease of navigation for veterans.',
      technicalArchitecture: 'Built with Next.js for optimal performance and SEO. Static generation for fast page loads. Responsive design for all devices.',
      technologyChoices: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      implementation: 'Developed a custom CMS integration for case studies and blog content. Implemented smooth page transitions and scroll-triggered animations.',
      engineeringChallenges: 'Balancing the serious nature of legal content with an approachable, modern design. Ensuring accessibility compliance for veteran users.',
      securityAndPerformance: 'Static generation for optimal performance. Optimized images and fonts. Secure form handling for contact inquiries.',
      currentStatus: 'Live in production. Case study documentation in progress.',
      lessonsLearned: 'Legal websites require a careful balance of authority and accessibility. Content strategy is as important as visual design.',
      nextImprovements: 'Add client portal integration. Expand case study library.'
    }
  },
  {
    slug: 'folio-v1',
    title: 'Douglus Folio Vol. 01',
    category: 'Personal Project',
    role: 'Design, Development',
    description: 'An earlier version of my portfolio, designed and built from the ground up.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    status: 'Production',
    statusNote: 'Awwwards Honorable Mention',
    caseStudy: {
      overview: 'The first version of my personal portfolio, showcasing my work as a designer and developer. Built from scratch with custom animations and interactions.',
      problem: 'Needed a portfolio that demonstrates both design and development skills while standing out from template-based portfolios.',
      targetUsers: 'Potential clients, employers, and design community.',
      role: 'Design, Development',
      designDirection: 'Experimental layout with bold typography, custom cursor interactions, and smooth page transitions. Dark theme with high contrast.',
      technicalArchitecture: 'Custom animation system using CSS and JavaScript. Optimized for 60fps animations. Modular component architecture.',
      technologyChoices: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      implementation: 'Built custom scroll-triggered animations, magnetic hover effects, and page transition system. Implemented dark/light mode.',
      engineeringChallenges: 'Performance optimization for complex animations. Cross-browser compatibility for custom cursor.',
      securityAndPerformance: 'Code splitting and lazy loading. Optimized bundle size. Static generation where possible.',
      currentStatus: 'Archived. Received Awwwards Honorable Mention.',
      lessonsLearned: 'Custom animations require careful performance monitoring. Design systems scale better than one-off components.',
      nextImprovements: 'Migrate animation system to Framer Motion. Add CMS for project management.'
    }
  },
  {
    slug: '01',
    title: 'Stockly',
    category: 'Inventory Management',
    role: 'Full-Stack Developer',
    description: 'A phone-first inventory management system designed for small businesses. Tracks stock movements, sales, purchases, and suppliers.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Prototype',
    statusNote: 'Core UI and local state management are complete. Multi-business backend architecture is currently in development.',
    caseStudy: {
      overview: 'Stockly is a mobile-first inventory management system built to replace pen-and-paper tracking for small retail businesses in Vietnam. It provides real-time visibility into stock levels, sales, and supplier orders.',
      problem: 'Small business owners lose significant revenue due to stockouts, overstocking, and unrecorded shrinkage. Existing enterprise ERPs are too complex and expensive, while basic spreadsheet solutions lack mobile accessibility and real-time syncing.',
      targetUsers: 'Retail shop owners, pharmacy managers, and small warehouse operators who need to track inventory on the go using their smartphones.',
      role: 'Sole Architect & Full-Stack Engineer',
      designDirection: 'The design prioritizes speed and thumb-friendly navigation. High-contrast UI for outdoor use, large tap targets, and a dashboard that surfaces critical alerts (low stock) immediately upon opening the app.',
      technicalArchitecture: 'The system uses a modular architecture. The frontend is a Next.js PWA for offline capabilities. The backend is designed as a multi-tenant API, allowing a single deployment to serve multiple independent businesses with isolated data.',
      technologyChoices: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Zustand'],
      implementation: 'Implemented a complex state machine for stock movements (e.g., a single "sale" event automatically decrements inventory, records revenue, and logs the transaction). Built a custom data-grid component optimized for mobile touch scrolling.',
      engineeringChallenges: 'The primary challenge was designing the database schema to support the planned multi-business architecture without sacrificing query performance for single-business views. Solved by implementing Row Level Security (RLS) in PostgreSQL.',
      securityAndPerformance: 'All API routes are protected by middleware checking session tokens. Database queries are heavily indexed. The PWA caches critical assets using Workbox, allowing the app to load instantly even on slow 3G networks.',
      currentStatus: 'The frontend prototype is fully functional with local state. The user can create products, record sales, and view reports. The backend API and database integration are currently being built.',
      lessonsLearned: 'Designing for mobile-first forced me to ruthlessly prioritize features. I learned that small business owners don\'t need complex analytics; they need to know what to reorder today.',
      nextImprovements: 'Complete the backend API integration. Implement barcode scanning using the device camera. Add SMS notifications for low-stock alerts.'
    }
  }
];
