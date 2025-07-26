import { pgTable as table } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import * as t from "drizzle-orm/pg-core";

export const maps_table = table("maps", {
  id: t.integer().primaryKey().generatedByDefaultAsIdentity(),

  title: t.varchar({ length: 256 }).notNull(),
  description: t.varchar({ length: 1024 }).notNull(),

  nodeCount: t.integer("node_count").default(0).notNull(),
  edgeCount: t.integer("edge_count").default(0).notNull(),

  isPublic: t.boolean("is_public").default(true).notNull(),

  author: t.varchar({ length: 256 }).notNull(),

  likes: t.integer().default(0).notNull(),
  views: t.integer().default(0).notNull(),

  thumbnail: t.varchar({ length: 256 }),

  mapData: t.jsonb("map_data"),

  userId: t
    .text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
});

export type DB_MapType = typeof maps_table.$inferSelect;
