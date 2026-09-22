import { db } from "@/db/db";
import { roles } from "@/db/schema/auth";
import { eq, ilike, sql } from "drizzle-orm";

// Get all roles with optional search & pagination
export async function getAllRoles({
    search = "",
    page = 1,
    limit = 10,
}: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    const offset = (page - 1) * limit;

    const whereClause = search
        ? ilike(roles.name, `%${search}%`)
        : undefined;

    const [data, [{ count }]] = await Promise.all([
        db
            .select()
            .from(roles)
            .where(whereClause)
            .orderBy(roles.createdAt)
            .limit(limit)
            .offset(offset),

        db
            .select({ count: sql<number>`COUNT(*)` })
            .from(roles)
            .where(whereClause),
    ]);

    return {
        data,
        meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
}

// Create role
export async function createRole(name: string) {
    const [created] = await db
        .insert(roles)
        .values({ name })
        .returning();
    return created;
}

// Update role
export async function updateRole(id: number, name: string) {
    const [updated] = await db
        .update(roles)
        .set({ name })
        .where(eq(roles.id, id))
        .returning();
    return updated;
}

// Delete role
export async function deleteRole(id: number) {
    await db.delete(roles).where(eq(roles.id, id));
}

// Find or create role by name
export async function findOrCreateRoleByName(name: string) {
    const existing = await db
        .select()
        .from(roles)
        .where(eq(roles.name, name))
        .limit(1);

    if (existing.length > 0) return existing[0];

    return await createRole(name);
}
