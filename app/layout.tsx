import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solomon — Software Engineer & Creative Technologist',
  description: 'Thoughtful engineering for useful, human-centered digital experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
