import { DB } from '../db';
import { TCreateStoreSchema, stores } from '../schema';

export async function seed(db: DB) {
  const storesData: TCreateStoreSchema[] = [
    {
      name: 'Berlian Motor',
      description: 'Toko bengkel motor',
    },
  ];

  await db.insert(stores).values(storesData);
}
