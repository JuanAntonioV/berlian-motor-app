import { DB } from '../db';
import { hashPassword } from '../hash';
import { userRoles, userStores, users } from '../schema';

export async function seed(db: DB) {
  const usersData = [
    {
      name: 'Admin',
      email: 'admin@email.com',
      password: await hashPassword('admin123'),
      status: true,
      roles: [1],
      stores: [1],
    },
    {
      name: 'User',
      email: 'user@email.com',
      password: await hashPassword('user123'),
      status: true,
      roles: [2],
      stores: [1],
    },
  ];

  const userInserted = await db.insert(users).values(usersData).returning();

  await Promise.all(
    userInserted.map(async (user) => {
      const userRoleData = {
        userId: user.id,
        roleId: usersData.find((userData) => userData.email === user.email)
          ?.roles[0],
      };

      const userStoreData = {
        userId: user.id,
        storeId: usersData.find((userData) => userData.email === user.email)
          ?.stores[0],
      };

      await db.insert(userRoles).values(userRoleData);
      await db.insert(userStores).values(userStoreData);
    })
  );
}
