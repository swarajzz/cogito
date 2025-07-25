"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/server/db";
import { maps_table } from "@/src/server/db/schema/map-schema";
import { MapCoreSchema, MapFullType } from "@/src/zod-schemas/map";
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

  return { success: true, id: createdMap[0]?.id };
};
