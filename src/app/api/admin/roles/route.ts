import { db } from "@/db/db";
import { roles } from "@/db/schema/auth";
import { getAllRoles } from "@/models/role.model";
import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAuthorization("role:create", async (_req, context) => {
  const { name } = await _req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Role name is required" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, name))
    .limit(1);

  if (existing) {
    return NextResponse.json({ success: true, role: existing });
  }

  const [newRole] = await db.insert(roles).values({ name }).returning();

  return NextResponse.json({ success: true, role: newRole });
});

export const GET = withAuthorization("role:read", async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const data = await getAllRoles({ search, page, limit });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/admin/roles error:", err);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
})
