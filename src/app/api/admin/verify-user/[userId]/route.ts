import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { assignRoleToUser, verifyUser } from "@/models/user.model";

export const PUT = withAuthorization("user:verify", async (_req, context) => {
  try {
    // const { userId } = context.params;
    const { roleId, userId } = await _req.json();
    const users = await verifyUser(userId);
    await assignRoleToUser({ userId, roleId });
    return Response.json({ success: true, message: "User verified", user: users });
  } catch (error) {
    console.log("Error verifying user:", error);
    return Response.json(
      { error: "Invalid input", details: error },
      { status: 400 }
    );
  }
});
