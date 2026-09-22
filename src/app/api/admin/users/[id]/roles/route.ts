import { assignRolesToUser, removeUserRole } from "@/models/user.model";
import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAuthorization("role:assign", async (req: NextRequest, { params }: { params: { id: string } }) => {


    const { roleIds, roleNames } = await req.json();
    await assignRolesToUser(Number(params.id), roleIds);
    return NextResponse.json({ message: "Roles assigned" });
})

export const DELETE = withAuthorization("role:unassigned", async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { roleId } = await req.json();
    await removeUserRole(Number(params.id), roleId);
    return NextResponse.json({ message: "Role removed" });
})
