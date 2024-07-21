import { DB } from '../db';
import { permissions, rolePermissions, roles } from '../schema';

export async function seed(db: DB) {
  const permissionData = await db
    .select({
      id: permissions.id,
    })
    .from(permissions);

  const superAdminPermissions = permissionData.map(
    (permission) => permission.id
  );

  const rolesData = [
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

  const roleIds = await db
    .insert(roles)
    .values(rolesData)
    .returning({ id: roles.id, name: roles.name });

  const rolePermissionsDatas = roleIds.map((roleId) => {
    const role = rolesData.find(
      (role) => role.permissions.length > 0 && role.name === roleId.name
    );

    if (!role) {
      return null;
    }

    return role.permissions.map((permissionId) => ({
      roleId: roleId.id,
      permissionId,
    }));
  });

  for (const rolePermissionData of rolePermissionsDatas) {
    if (!rolePermissionData) {
      continue;
    }

    await db.insert(rolePermissions).values(rolePermissionData);
  }
}
