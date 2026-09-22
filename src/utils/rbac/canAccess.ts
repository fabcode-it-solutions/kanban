// src/utils/rbac/canAccess.ts

import { db } from "@/db/db";
import { eq, and, inArray } from "drizzle-orm";
import {
  rolePermissions,
  permissions,
  roles,
  userRoles,
  userProjectRoles,
} from "@/db/schema/auth";

export async function canAccess(
  userId: string,
  projectId: string,
  permissionName: string
): Promise<boolean> {
  const [isAdminRole] = await db
    .select()
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(and(eq(userRoles.userId, Number(userId)), eq(roles.name, "admin")))
    .limit(1);

  if (isAdminRole) return true;

  // 1. Get all role_ids assigned to user for that project
  const getUserProjectRoles = await db
    .select({ roleId: userRoles.roleId })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.userId, Number(userId)),
        eq(userProjectRoles.projectId, Number(projectId))
      )
    );

  if (getUserProjectRoles.length === 0) return false;

  const roleIds = getUserProjectRoles.map((r) => r.roleId);

  // 2. Get permission_id for the given permission name
  const [permission] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.name, permissionName));

  if (!permission) return false;

  // 3. Check if any of user's roles has that permission
  const permissionCheck = await db
    .select()
    .from(rolePermissions)
    .where(
      and(
        eq(rolePermissions.permissionId, permission.id),
        inArray(rolePermissions.roleId, roleIds)
      )
    );

  return permissionCheck.length > 0;
}
