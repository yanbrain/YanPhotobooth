import { Suspense } from 'react';
import { SuccessPage } from '@/views/success/ui/SuccessPage';

export default function SuccessRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cyber-darker" />}>
      <SuccessPage />
    </Suspense>
  );
}
