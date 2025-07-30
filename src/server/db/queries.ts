import "server-only";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/server/db";
import { maps_table as mapsSchema } from "@/src/server/db/schema/map-schema";
import { tags_table as tagsSchema } from "@/src/server/db/schema/tags-schema";
import {
  MapCoreSchema,
  MapDbSchemaArr,
  MapDbType,
} from "@/src/zod-schemas/map";
import { asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { MAPS_PER_PAGE } from "@/src/lib/constants";

export const QUERIES = {
  getMapData: async function (mapId: string): Promise<MapDbType | null> {
    await db
      .update(mapsSchema)
      .set({ views: sql`${mapsSchema.views} + 1` })
      .where(eq(mapsSchema.id, Number(mapId)));

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
  },

  getUserMaps: async function (page: number = 1) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("User not found");
    }

    const userMaps = await db
      .select()
      .from(mapsSchema)
      .orderBy(asc(mapsSchema.createdAt), asc(mapsSchema.id))
      .limit(MAPS_PER_PAGE)
      .offset((page - 1) * MAPS_PER_PAGE)
      .where(eq(mapsSchema.userId, session.user.id));

    const result = MapDbSchemaArr.safeParse(userMaps);

    if (!result.success) {
      console.error("❌ Invalid map data:", result.error);
      return {
        data: [],
        total: 0,
        perPage: MAPS_PER_PAGE,
        page,
      };
    }

    const [countResult] = await db
      .select({ count: count() })
      .from(mapsSchema)
      .where(eq(mapsSchema.userId, session.user.id));

    return {
      data: result.data,
      total: countResult.count,
      perPage: MAPS_PER_PAGE,
      page,
    };
  },

  getExploreMaps: async function (page: number = 1) {
    const exploreMaps = await db
      .select()
      .from(mapsSchema)
      .orderBy(asc(mapsSchema.createdAt), asc(mapsSchema.id))
      .limit(MAPS_PER_PAGE)
      .offset((page - 1) * MAPS_PER_PAGE)
      .where(eq(mapsSchema.isPublic, true));

    const result = MapDbSchemaArr.safeParse(exploreMaps);

    if (!result.success) {
      console.error("❌ Invalid map data:", result.error);
      return {
        data: [],
        total: 0,
        perPage: MAPS_PER_PAGE,
        page,
      };
    }

    const [countResult] = await db
      .select({ count: count() })
      .from(mapsSchema)
      .where(eq(mapsSchema.isPublic, true));

    return {
      data: result.data,
      total: countResult.count,
      perPage: MAPS_PER_PAGE,
      page,
    };
  },

  getFeaturedMaps: async function (): Promise<MapDbType[]> {
    const featuredMaps = await db
      .select()
      .from(mapsSchema)
      .orderBy(desc(mapsSchema.likes))
      .limit(3);

    const result = MapDbSchemaArr.safeParse(featuredMaps);

    if (!result.success) {
      console.error("❌ Invalid map data:", result.error);
      return [];
    }

    return result.data;
  },

  getTagRecords: async function (tags: string[]) {
    return db
      .select({ id: tagsSchema.id, name: tagsSchema.name })
      .from(tagsSchema)
      .where(inArray(tagsSchema.name, tags));
  },

  getTags: async function () {
    return db.select().from(tagsSchema);
  },
};
