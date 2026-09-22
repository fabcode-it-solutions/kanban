import { db } from "@/db/db";
import { permissions } from "@/db/schema/auth";
import { eq, sql } from "drizzle-orm";

export async function getAllPermissions(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [data, [{ count }]] = await Promise.all([
        db
            .select()
            .from(permissions)
            .limit(limit)
            .offset(offset)
            .orderBy(permissions.createdAt),

        db
            .select({ count: sql<number>`COUNT(*)` })
            .from(permissions),
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

export async function createPermission(name: string, description: string) {
    const [created] = await db
        .insert(permissions)
        .values({ name, description })
        .returning();
    return created;
}

export async function updatePermission(id: number, name: string, description: string) {
    const [updated] = await db
        .update(permissions)
        .set({ name, description })
        .where(eq(permissions.id, id))
        .returning();
    return updated;
}

export async function deletePermission(id: number) {
    await db.delete(permissions).where(eq(permissions.id, id));
}
