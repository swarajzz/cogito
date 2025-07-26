import { maps_table } from "@/src/server/db/schema/map-schema";
import { createSelectSchema } from "drizzle-zod";

import { z } from "zod/v4";

export const MapResourceSchema = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  description: z.string(),
});

export const MapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.any(),
  description: z.string(),
  importance: z.number().min(1).max(10),
  discipline: z.string(),
  year: z.string(),
  period: z.string(),
  location: z.string(),
  resources: z.array(MapResourceSchema),
});

export const MapEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string(),
  type: z.any(),
  strength: z.number().min(1).max(5),
});

// Response getting from AI
export const MapFullSchema = z.object({
  title: z.string(),
  description: z.string(),
  summary: z.string(),
  node_count: z.number(),
  edge_count: z.number(),
  nodes: z.array(MapNodeSchema),
  edges: z.array(MapEdgeSchema),
  disciplines: z.array(z.string()),
  timespan: z.object({
    start: z.string(),
    end: z.string(),
  }),
  geography: z.array(z.string()),
  tags: z.array(z.string()),
  keyThemes: z.array(z.string()),
});

// Data storing in the DB
export const MapCoreSchema = MapFullSchema.omit({
  title: true,
  description: true,
  node_count: true,
  edge_count: true,
});

// DB table data
export const MapDbSelectSchema = createSelectSchema(maps_table);

// DB table data extending mapData
export const MapDbSchema = MapDbSelectSchema.extend({
  mapData: MapCoreSchema,
});

export type MapFullType = z.infer<typeof MapFullSchema>;
export type MapCoreType = z.infer<typeof MapCoreSchema>;
export type MapDbType = z.infer<typeof MapDbSchema>;


export const MapDbSchemaArr = z.array(MapDbSchema);
