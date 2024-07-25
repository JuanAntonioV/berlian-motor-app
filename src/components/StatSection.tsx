import { getDashboardStats } from '@/getters/analyticGetter';
import StatItem from './StatItem';

export default async function StatSection() {
  const data = await getDashboardStats();

  if (!data) return null;

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {data?.map((stat, index) => (
        <StatItem key={index} item={stat} />
      ))}
    </div>
  );
}
