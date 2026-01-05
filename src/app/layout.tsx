import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/shared/ui/ToastContainer';
import { NetworkStatus } from '@/shared/ui/NetworkStatus';
import { KeyboardShortcuts } from '@/shared/ui/KeyboardShortcuts';
import { IdleTimeout } from '@/shared/ui/IdleTimeout';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

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
      <body>
        <ErrorBoundary>
          {children}
          <ToastContainer />
          <NetworkStatus />
          <KeyboardShortcuts />
          <IdleTimeout timeout={120000} warningTime={30000} />
        </ErrorBoundary>
      </body>
    </html>
  );
}
