import { withAuthorization } from "@/utils/rbac/withAuthorization";
import { getUnverifiedUsers } from "@/models/user.model";

export const GET = withAuthorization("user:verify", async () => {
  const result = await getUnverifiedUsers();
  return Response.json({ users: result });
});
