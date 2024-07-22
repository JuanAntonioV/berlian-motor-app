import { getUser } from '@/getters/userGetter';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' });
  }

  return NextResponse.json(user);
}
