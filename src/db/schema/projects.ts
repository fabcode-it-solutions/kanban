// src/db/schema/projects.ts

import {
  pgTable,
  serial,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").unique(),
  code: text("code").unique(),
  status: text("status").default("to-do"),

  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),

  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
