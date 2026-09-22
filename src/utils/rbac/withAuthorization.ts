import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { canAccess } from "./canAccess";

export function withAuthorization(
  permission: string,
  handler: (req: NextRequest, context: any, userId: string) => Promise<Response>
) {
  return async function (req: NextRequest, context: any) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = context.params?.projectId;
    // if (!projectId) {
    //   return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    // }

    const isAllowed = await canAccess(userId, projectId, permission);

    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(req, context, userId);
  };
}
