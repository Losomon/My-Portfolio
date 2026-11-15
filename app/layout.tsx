import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solomon Mwangi — Web Designer from Kenya',
  description:
    'Web designer based in Nairobi, Kenya, focused on web design, interaction design, and creative development.',
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