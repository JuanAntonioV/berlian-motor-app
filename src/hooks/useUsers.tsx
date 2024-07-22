'use client';

import { TSelectUserSchema } from '@/lib/schema';
import { useEffect, useState } from 'react';

type UserWithRolesPermissions = TSelectUserSchema & {
  permissions: string[];
  permissionIds: number[];
  roleIds: number[];
  storeIds: number[];
};

export function useUsers() {
  const [user, setUser] = useState<UserWithRolesPermissions | null>(null);
  console.log('🚀 ~ useUsers ~ user:', user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserApi() {
      setLoading(true);
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setLoading(false);
      }
    }
    getUserApi();
  }, []);

  return { user, loading };
}
