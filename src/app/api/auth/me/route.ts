import { getUser } from '@/getters/userGetter';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUser();

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.status(200).json({ user });
}
