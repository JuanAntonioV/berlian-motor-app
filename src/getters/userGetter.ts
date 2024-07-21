'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { verifySession } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId as bigint),
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      joinDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return null;
  }

  const userRoles = await db.query.userRoles.findMany({
    where: eq(users.id, user.id),
    with: {
      role: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          rolePermissions: {
            with: {
              permission: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const userRoleIds = userRoles.map((userRole) => userRole.role.id);
  const rolePermissionIds = userRoles.map((userRole) =>
    userRole.role.rolePermissions.map(
      (rolePermission) => rolePermission.permission.id
    )
  );
  console.log('🚀 ~ getUser ~ userRoleIds:', userRoleIds);

  // make unique
  const uniqueRolePermissionIds = Array.from(new Set(rolePermissionIds.flat()));

  const userPermissions = await db.query.userPermissions.findMany({
    where: eq(users.id, user.id),
    with: {
      permission: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  const userDirectPermissionIds = userPermissions.map(
    (userPermission) => userPermission.permission.id
  );

  // merge direct and role permissions and make unique
  const userPermissionIds = Array.from(
    new Set([...userDirectPermissionIds, ...uniqueRolePermissionIds])
  );

  const userStores = await db.query.userStores.findMany({
    where: eq(users.id, user.id),
    with: {
      store: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  const userStoreIds = userStores.map((userStore) => userStore.store.id);

  const userData = {
    ...user,
    roles: userRoles,
    permissions: userPermissions,
    stores: userStores,
    roleIds: userRoleIds,
    permissionIds: userPermissionIds,
    storeIds: userStoreIds,
  };

  return userData;
});
