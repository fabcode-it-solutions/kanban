import { db } from "@/db/db";
import { users, userRoles, roles } from "@/db/schema/auth";
import { and, eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const AssignRoleSchema = z.object({
  userId: z.number().int(),
  roleId: z.number().int(),
  projectId: z.number().int().optional(),
});

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return user;
}

export async function getUserByIdWithRoles(id: number) {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isVerified: users.isVerified,
      roleName: roles.name,
    })
    .from(users)
    .leftJoin(userRoles, eq(userRoles.userId, users.id))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(users.id, id));

  if (rows.length === 0) return null;

  const { name, email, isVerified } = rows[0];
  const rolesList = rows.map((r) => r.roleName).filter(Boolean);

  return { id, name, email, isVerified, roles: rolesList };
}

export async function updateUserDetails(id: number, updates: { name?: string; email?: string }) {
  const [user] = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  return user;
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}


export async function verifyUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return { error: "User not found", status: 404 };

  if (!user.isVerified) {
    return { error: "User is not verified", status: 403 };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
  if (!isPasswordValid) {
    return { error: "Incorrect password", status: 401 };
  }

  const roleResult = await db
    .select({
      roleName: roles.name,
    })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, user.id));

  const rolesList = roleResult.map((r) => r.roleName);

  const { password: _, ...safeUser } = user;
  return {
    user: {
      ...safeUser,
      roles: rolesList,
    },
  };
}

export async function getVerifiedUsersWithRoles({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isVerified: users.isVerified,
      roleName: roles.name,
    })
    .from(users)
    .leftJoin(userRoles, eq(userRoles.userId, users.id))
    .leftJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(users.isVerified, true))
    .limit(pageSize)
    .offset(offset);

  // Group roles by user ID
  const grouped = result.reduce((acc, row) => {
    const existing = acc.find((u) => u.id === row.id);
    if (existing) {
      if (row.roleName && !existing.roles.includes(row.roleName)) {
        existing.roles.push(row.roleName);
      }
    } else {
      acc.push({
        id: row.id,
        name: row.name,
        email: row.email,
        isVerified: row.isVerified,
        roles: row.roleName ? [row.roleName] : [],
      });
    }
    return acc;
  }, [] as { id: number; name: string; email: string; isVerified: boolean; roles: string[] }[]);

  // Count total verified users (for pagination UI)
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`.as("count"),
    })
    .from(users)
    .where(eq(users.isVerified, true));

  return {
    users: grouped,
    total: Number(count),
    currentPage: page,
    totalPages: Math.ceil(Number(count) / pageSize),
  };
}


export const getUnverifiedUsers = async () => {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.isVerified, false));
};

export const verifyUser = async (userId: string) => {
  return db
    .update(users)
    .set({ isVerified: true })
    .where(eq(users.id, Number(userId))).returning({ users });
};

export const assignRoleToUser = async (input: unknown) => {
  const parsed = AssignRoleSchema.safeParse(input);
  if (!parsed.success) {
    throw parsed.error;
  }

  const { userId, roleId } = parsed.data;

  return db.insert(userRoles).values({
    userId,
    roleId,
  });
};

export async function assignRolesToUser(userId: number, roleIds: number[]) {
  const values = roleIds.map((roleId) => ({ userId, roleId }));
  await db.insert(userRoles).values(values).onConflictDoNothing();
}

export async function removeUserRole(userId: number, roleId: number) {
  await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
}

