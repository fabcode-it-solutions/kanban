import { getAllPermissions, createPermission } from "@/models/permissions.model";
import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuthorization("permission:read", async (req: NextRequest) => {
    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const limit = Number(req.nextUrl.searchParams.get("limit") || "10");

    const result = await getAllPermissions(page, limit);

    return NextResponse.json(result);
})

export const POST = withAuthorization("user:create", async (req: NextRequest) => {
    const { name, description } = await req.json();

    if (!name || !description) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await createPermission(name, description);
    return NextResponse.json({ data: created });
})
