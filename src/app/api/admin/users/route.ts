import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { createUser, getVerifiedUsersWithRoles } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuthorization("user:read", async (req: NextRequest) => {
    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const limit = Number(req.nextUrl.searchParams.get("limit") || "10");
    const { users, total, currentPage, totalPages } = await getVerifiedUsersWithRoles({
        page: page,
        pageSize: limit,
    });
    return Response.json({ users });
});

export const POST = withAuthorization("user:read", async (req: NextRequest) => {
    const { name, email, password } = await req.json();
    const user = await createUser({ name, email, password });
    return NextResponse.json({ user });
})