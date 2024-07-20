import { DB } from '../db';
import { TCreateRoleSchema, permissions, roles } from '../schema';

export async function seed(db: DB) {
  const permissionData = await db
    .select({
      id: permissions.id,
    })
    .from(permissions);

  const superAdminPermissions = permissionData.map(
    (permission) => permission.id
  );

  const rolesData: TCreateRoleSchema[] = [
    {
      name: 'Super Admin',
      permissions: superAdminPermissions,
    },
    {
      name: 'Admin',
      permissions: superAdminPermissions.filter((id) => id !== 3 && id !== 4),
    },
    {
      name: 'Karyawan',
      permissions: superAdminPermissions.filter(
        (id) => id !== 1 && id !== 3 && id !== 4
      ),
    },
  ];

  await db.insert(roles).values(rolesData);
}
