import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solomon Mwangi — Software Engineer & Creative Technologist',
  description:
    'Independent software engineer based in Nairobi, Kenya, focused on web engineering, interaction design, and front-end development.',
};

export const viewport: Viewport = {
  themeColor: '#1e1e1e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}