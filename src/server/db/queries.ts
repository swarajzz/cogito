import { user as usersSchema } from "@/migrations/schema";
import { db } from "@/src/server/db";
import { maps as mapsSchema } from "@/src/server/db/schema/maps";
import { eq } from "drizzle-orm";

export function getUserMap(mapId: string) {
  return db.select().from(mapsSchema).where(eq(mapsSchema.userId, mapId));
}

export async function getFeaturedMaps() {
  return db.select().from(mapsSchema);
}
