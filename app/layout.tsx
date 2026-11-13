import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Douglus Nguyen — Web Designer from Vietnam',
  description:
    'Web designer based in Ho Chi Minh City, Vietnam, focused on web design, interaction design, and creative development.',
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