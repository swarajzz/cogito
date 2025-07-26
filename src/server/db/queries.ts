import { db } from "@/src/server/db";
import { maps_table as mapsSchema } from "@/src/server/db/schema/map-schema";
import { tags_table } from "@/src/server/db/schema/tags-schema";
import { MapCoreSchema, MapDbSchema, MapDbType } from "@/src/zod-schemas/map";
import { eq, inArray } from "drizzle-orm";
import z4, { z } from "zod/v4";

export async function getMapData(mapId: string): Promise<MapDbType | null> {
  const result = await db
    .select()
    .from(mapsSchema)
    .where(eq(mapsSchema.id, Number(mapId)));

  const map = result[0];

  if (!map) return null;

  const parsed = MapCoreSchema.safeParse(map.mapData);

  if (!parsed.success) {
    console.log(parsed.error.format());
    return null;
  }

  return {
    ...map,
    mapData: parsed.data,
  };
}

export function getUserMap(userId: string) {
  return db.select().from(mapsSchema).where(eq(mapsSchema.userId, userId));
}

export async function getFeaturedMaps(): Promise<MapDbType[]> {
  const featuredMaps = await db.select().from(mapsSchema);

  const FeaturedMapsSchema = z.array(MapDbSchema);

  const result = FeaturedMapsSchema.safeParse(featuredMaps);

  if (!result.success) {
    console.error("❌ Invalid map data:", result.error);
    return [];
  }

  return result.data;
}

export async function getTagRecords(tags: string[]) {
  return db
    .select({ id: tags_table.id, name: tags_table.name })
    .from(tags_table)
    .where(inArray(tags_table.name, tags));
}
