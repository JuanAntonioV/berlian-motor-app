import SignOutButton from '@/components/SignOutButton';
import { getUser } from '@/getters/userGetter';

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
}
