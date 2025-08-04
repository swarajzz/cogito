"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/server/db";
import { QUERIES } from "@/src/server/db/queries";
import { maps_table } from "@/src/server/db/schema/map-schema";
import { mapOnTags, tags_table } from "@/src/server/db/schema/tags-schema";
import { MapCoreSchema, MapFullType } from "@/src/zod-schemas/map";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occured.",
    };
  }
};

export const signUp = async (
  userName: string,
  email: string,
  password: string
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name: userName,
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Signed up successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occured.",
    };
  }
};

export const createMap = async (data: MapFullType) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not found");
  }

  const { title, description, node_count, edge_count, ...mapData } = data;

  const parsedMapData = MapCoreSchema.safeParse(mapData);

  if (!parsedMapData.success) {
    console.error("Invalid mapData", parsedMapData.error.format());
    throw new Error("Invalid map data format");
  }

  const createdMap = await db
    .insert(maps_table)
    .values({
      title: title,
      description: description,
      nodeCount: node_count,
      edgeCount: edge_count,
      author: session.user.name,
      mapData: parsedMapData.data,
      userId: session.user.id,
    })
    .returning({ id: maps_table.id });

  const mapId = createdMap[0]?.id;

  if (mapId && data?.tags?.length > 0) {
    await db
      .insert(tags_table)
      .values(data.tags.map((tag) => ({ name: tag })))
      .onConflictDoNothing();

    const tagRecords = await QUERIES.getTagRecords(data.tags);

    const relations = tagRecords.map((tag) => ({
      mapId,
      tagId: tag.id,
    }));

    await db.insert(mapOnTags).values(relations);
  }

  return { success: true, id: mapId };
};

export const deleteMap = async (id: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not found");
  }

  await db.delete(maps_table).where(eq(maps_table.id, id));
};

export const likeMap = async (mapId: number) => {
  const [updatedMap] = await db
    .update(maps_table)
    .set({ likes: sql`${maps_table.likes} + 1` })
    .where(eq(maps_table.id, mapId))
    .returning({ likes: maps_table.likes });

  return updatedMap.likes;
};
