// scripts/seed-permissions.ts

import { db } from "@/db/db";
import { permissions } from "@/db/schema/auth"; // adjust path if needed
import { eq } from "drizzle-orm";

const permissionList: { name: string; description: string }[] = [
  // Project
  { name: "project:create", description: "Create new projects" },
  { name: "project:view", description: "View project details" },
  { name: "project:update", description: "Update project settings" },
  { name: "project:delete", description: "Delete a project" },
  { name: "project:archive", description: "Archive or unarchive a project" },
  { name: "project:invite_member", description: "Invite members to project" },
  { name: "project:remove_member", description: "Remove members from project" },
  { name: "project:view_members", description: "View project members" },

  // Board
  { name: "board:create", description: "Create boards in a project" },
  { name: "board:view", description: "View boards" },
  { name: "board:update", description: "Update boards" },
  { name: "board:delete", description: "Delete boards" },

  // Column
  { name: "column:create", description: "Add new columns to a board" },
  { name: "column:update", description: "Rename or reorder columns" },
  { name: "column:delete", description: "Delete columns" },

  // Task
  { name: "task:create", description: "Create tasks" },
  { name: "task:view", description: "View tasks" },
  { name: "task:update", description: "Edit tasks" },
  { name: "task:delete", description: "Delete tasks" },
  { name: "task:assign", description: "Assign tasks to users" },
  { name: "task:move", description: "Move tasks between columns" },

  // Role & Permission Management
  { name: "role:create", description: "Create new roles" },
  { name: "role:assign", description: "Assign roles to users" },
  { name: "role:revoke", description: "Revoke user roles" },
  { name: "permission:assign", description: "Assign permissions to roles" },
  { name: "permission:view", description: "View role permissions" },
];

async function seedPermissions() {
  console.log("🔄 Seeding permissions...");

  for (const perm of permissionList) {
    const [existing] = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, perm.name));

    if (!existing) {
      await db.insert(permissions).values(perm);
      console.log(`✅ Inserted: ${perm.name}`);
    } else {
      console.log(`⏩ Skipped (already exists): ${perm.name}`);
    }
  }

  console.log("🎉 Permissions seeding completed!");
}

seedPermissions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error seeding permissions:", err);
    process.exit(1);
  });
