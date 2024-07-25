import PageTitle from '@/components/PageTitle';
import StatSection from '@/components/StatSection';
import { Suspense } from 'react';

export default async function DashboardPage() {
  return (
    <div>
      <PageTitle
        title='Dashboard'
        description='Lihat statistik dan data penting lainnya di sini.'
      />

      <Suspense fallback={<div>Loading...</div>}>
        <StatSection />
      </Suspense>
    </div>
  );
}
