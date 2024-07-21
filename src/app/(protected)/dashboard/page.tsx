import SignOutButton from '@/components/SignOutButton';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  console.log('🚀 ~ DashboardPage ~ session:', session);

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
}
