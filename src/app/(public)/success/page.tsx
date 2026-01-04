import { Suspense } from 'react';
import { SuccessPage } from '@/views/success/ui/SuccessPage';

export default function SuccessRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-darker" />}>
      <SuccessPage />
    </Suspense>
  );
}
