import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Photobooth',
  description: 'Transform your photos with AI-powered styles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
