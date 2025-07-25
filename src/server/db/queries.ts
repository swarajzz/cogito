import { db } from "@/src/server/db";
import { maps_table as mapsSchema } from "@/src/server/db/schema/map-schema";
import {
  MapDbSchema,
  MapDbType,
  MapFullSchema,
} from "@/src/zod-schemas/map";
import { eq } from "drizzle-orm";

export async function getMapData(mapId: string): Promise<MapDbType | null> {
  const result = await db
    .select()
    .from(mapsSchema)
    .where(eq(mapsSchema.id, Number(mapId)));

  const map = result[0];

  if (!map) return null;

  const parsed = MapFullSchema.safeParse(map.mapData);

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
  const result = db.select().from(mapsSchema);

  const parsedMapData = (await result).map((row) => MapDbSchema.parse(row));

  return parsedMapData;
}
