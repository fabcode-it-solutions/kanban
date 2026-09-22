import { NextRequest, NextResponse } from "next/server";
import {
    deletePermission,
    updatePermission,
} from "@/models/permissions.model";
import { withAuthorization } from "@/utils/rbac/withAuthorization";

export const PUT = withAuthorization("permission:read", async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { name, description } = await req.json();
    const updated = await updatePermission(Number(params.id), name, description);
    return NextResponse.json({ data: updated });
})

export const DELETE = withAuthorization("permission:delete", async (_: NextRequest, { params }: { params: { id: string } }) => {
    await deletePermission(Number(params.id));
    return NextResponse.json({ success: true });
})
