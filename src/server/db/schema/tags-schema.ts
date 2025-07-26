import { maps_table } from "@/src/server/db/schema/map-schema";
import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const tags_table = table("tags", {
  id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: t.text("name").notNull().unique(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

export const mapOnTags = table(
  "map_tags",
  {
    mapId: t
      .integer("map_id")
      .notNull()
      .references(() => maps_table.id, { onDelete: "cascade" }),
    tagId: t
      .integer("tag_id")
      .notNull()
      .references(() => tags_table.id, { onDelete: "cascade" }),
  },
  (table) => [t.primaryKey({ columns: [table.mapId, table.tagId] })]
);
