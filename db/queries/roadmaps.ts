import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../index";
import { roadmapsTable } from "../schemas/roadmaps";
import {
  createRoadmapSchema,
  fetchRoadmapsParamsSchema,
} from "../schemas/validation/roadmaps";
import {
  PaginationParams,
  resolvePagination,
  toPaginatedResult,
} from "./types";

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type FetchRoadmapsManyParams = PaginationParams &
  z.infer<typeof fetchRoadmapsParamsSchema>;

export async function createRoadmap(
  userId: string,
  input: CreateRoadmapInput,
) {
  const [roadmap] = await db
    .insert(roadmapsTable)
    .values({
      userId,
      topic: input.topic,
      stepsJson: input.stepsJson,
    })
    .returning();

  return roadmap;
}

export async function fetchRoadmapsMany(
  userId: string,
  params: FetchRoadmapsManyParams = {},
) {
  const { page, pageSize, offset } = resolvePagination(params);

  const where = eq(roadmapsTable.userId, userId);

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        roadmapId: roadmapsTable.roadmapId,
        topic: roadmapsTable.topic,
        stepsJson: roadmapsTable.stepsJson,
        createdAt: roadmapsTable.createdAt,
      })
      .from(roadmapsTable)
      .where(where)
      .orderBy(desc(roadmapsTable.createdAt))
      .limit(pageSize)
      .offset(offset),

    db.select({ total: count() }).from(roadmapsTable).where(where),
  ]);

  return toPaginatedResult(data, total, page, pageSize);
}

export async function fetchRoadmapById(roadmapId: string, userId: string) {
  const [row] = await db
    .select()
    .from(roadmapsTable)
    .where(
      and(
        eq(roadmapsTable.roadmapId, roadmapId),
        eq(roadmapsTable.userId, userId),
      ),
    );

  return row ?? null;
}

export async function deleteRoadmap(roadmapId: string, userId: string) {
  const [row] = await db
    .delete(roadmapsTable)
    .where(
      and(
        eq(roadmapsTable.roadmapId, roadmapId),
        eq(roadmapsTable.userId, userId),
      ),
    )
    .returning();

  return row ?? null;
}
