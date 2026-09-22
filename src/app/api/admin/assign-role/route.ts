import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { assignRoleToUser } from "@/models/user.model";

export const POST = withAuthorization("role:assign", async (req) => {
  const body = await req.json();

  try {
    await assignRoleToUser(body);
    return Response.json({ success: true, message: "Role assigned" });
  } catch (error) {
    return Response.json(
      { error: "Invalid input", details: error },
      { status: 400 }
    );
  }
});
