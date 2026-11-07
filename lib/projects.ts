export interface CaseStudyContent {
  overview: string;
  problem: string;
  targetUsers: string;
  role: string;
  designDirection: string;
  technicalArchitecture: string;
  architectureDiagram?: string;
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
  repoUrl?: string;
  liveUrl?: string;
  media: { type: 'video' | 'image'; src: string; alt: string };
  caseStudy: CaseStudyContent;
  gallery?: { src: string; alt: string }[];
}

export const projects: Project[] = [
  {
    slug: 'stockly',
    title: 'Stockly',
    category: 'Inventory Management',
    role: 'Full-Stack Developer',
    description: 'A phone-first inventory management system designed for small businesses. Tracks stock movements, sales, purchases, and suppliers.',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Prototype',
    statusNote: 'Core UI and local state management are complete. Multi-business backend architecture is currently in development.',
    repoUrl: 'https://github.com/yourusername/stockly',
    media: { type: 'video', src: '/videos/stockly-demo.webm', alt: 'Stockly dashboard demo' },
    caseStudy: {
      overview: 'Stockly is a mobile-first inventory management system built to replace pen-and-paper tracking for small retail businesses in Kenya. It provides real-time visibility into stock levels, sales, and supplier orders.',
      problem: 'Small business owners lose significant revenue due to stockouts, overstocking, and unrecorded shrinkage. Existing enterprise ERPs are too complex and expensive, while basic spreadsheet solutions lack mobile accessibility and real-time syncing.',
      targetUsers: 'Retail shop owners, pharmacy managers, and small warehouse operators who need to track inventory on the go using their smartphones.',
      designDirection: 'The design prioritizes speed and thumb-friendly navigation. High-contrast UI for outdoor use, large tap targets, and a dashboard that surfaces critical alerts (low stock) immediately upon opening the app.',
      technicalArchitecture: 'The system uses a modular architecture. The frontend is a Next.js PWA for offline capabilities. The backend is designed as a multi-tenant API, allowing a single deployment to serve multiple independent businesses with isolated data.',
      architectureDiagram: '/images/stockly-architecture.avif',
      technologyChoices: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Zustand'],
      implementation: 'Implemented a complex state machine for stock movements (e.g., a single "sale" event automatically decrements inventory, records revenue, and logs the transaction). Built a custom data-grid component optimized for mobile touch scrolling.',
      engineeringChallenges: 'The primary challenge was designing the database schema to support the planned multi-business architecture without sacrificing query performance for single-business views. Solved by implementing Row Level Security (RLS) in PostgreSQL.',
      securityAndPerformance: 'All API routes are protected by middleware checking session tokens. Database queries are heavily indexed. The PWA caches critical assets using Workbox, allowing the app to load instantly even on slow 3G networks.',
      currentStatus: 'The frontend prototype is fully functional with local state. The user can create products, record sales, and view reports. The backend API and database integration are currently being built.',
      lessonsLearned: 'Designing for mobile-first forced me to ruthlessly prioritize features. I learned that small business owners don\'t need complex analytics; they need to know what to reorder today.',
      nextImprovements: 'Complete the backend API integration. Implement barcode scanning using the device camera. Add SMS notifications for low-stock alerts.'
    },
    gallery: [
      { src: '/images/stockly-dashboard.avif', alt: 'Stockly main dashboard showing low stock alerts' },
      { src: '/images/stockly-movement.avif', alt: 'Recording a new stock movement in Stockly' }
    ]
  }
];
