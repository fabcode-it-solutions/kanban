import {
    deleteUserById,
    getUserByIdWithRoles,
    updateUserDetails,
} from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const user = await getUserByIdWithRoles(Number(params.id));
    return NextResponse.json({ user });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { name, email } = await req.json();
    const updated = await updateUserDetails(Number(params.id), { name, email });
    return NextResponse.json({ user: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    await deleteUserById(Number(params.id));
    return NextResponse.json({ message: "User deleted" });
}
