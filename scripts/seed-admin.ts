#!/usr/bin/env ts-node
import { db } from "../src/db/db";
import { users, roles, userRoles } from "../src/db/schema/auth";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

dotenv.config();

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("email", {
      type: "string",
      description: "Admin email address",
    })
    .option("password", {
      type: "string",
      description: "Admin password",
    })
    .option("name", {
      type: "string",
      description: "Admin display name",
      default: "System Administrator",
    })
    .parse();

  const ADMIN_EMAIL =
    argv.email || process.env.ADMIN_EMAIL || "admin@example.com";
  const ADMIN_PASSWORD =
    argv.password || process.env.ADMIN_PASSWORD || "admin123";
  const ADMIN_NAME = "System Administrator";

  console.log(`🌐 Using Admin Email: ${ADMIN_EMAIL}`);
  console.log(`🔑 Using Admin Password: ${ADMIN_PASSWORD}`);

  console.log("🌱 Starting seeding process...");

  try {
    await db.transaction(async (tx) => {
      // 1. Ensure Admin role exists
      const [adminRole] = await tx
        .insert(roles)
        .values({
          name: "admin",
        })
        .returning();

      // 2. Create or update admin user
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      const [adminUser] = await tx
        .insert(users)
        .values({
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          password: hashedPassword,
          isVerified: true,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            name: ADMIN_NAME,
            password: hashedPassword,
            isVerified: true,
            updatedAt: new Date(),
          },
        })
        .returning({ id: users.id });

      // 3. Assign admin role to user
      await tx
        .insert(userRoles)
        .values({
          userId: adminUser.id,
          roleId: adminRole.id,
        })
        .onConflictDoNothing();

      console.log("✅ Admin user and role setup complete");
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Script execution failed:", error);
  process.exit(1);
});
