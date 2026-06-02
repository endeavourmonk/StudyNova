import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../index";
import { subjectsTable } from "../schemas/subjects";
import {
  PaginationParams,
  resolvePagination,
  toPaginatedResult,
} from "./types";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../schemas/validation/subjects";

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;

export async function fetchSubjectsMany(
  userId: string,
  params: PaginationParams = {},
) {
  const { page, pageSize, offset } = resolvePagination(params);
  const where = eq(subjectsTable.userId, userId);

  const [data, [{ total }]] = await Promise.all([
    db
      .select()
      .from(subjectsTable)
      .where(where)
      .orderBy(desc(subjectsTable.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(subjectsTable).where(where),
  ]);

  return toPaginatedResult(data, total, page, pageSize);
}

export async function fetchSubjectById(subjectId: string, userId: string) {
  const [subject] = await db
    .select()
    .from(subjectsTable)
    .where(
      and(
        eq(subjectsTable.subjectId, subjectId),
        eq(subjectsTable.userId, userId),
      ),
    );

  return subject ?? null;
}

export async function createSubject(userId: string, input: CreateSubjectInput) {
  const [subject] = await db
    .insert(subjectsTable)
    .values({ ...input, userId })
    .returning();

  return subject;
}

export async function updateSubject(
  subjectId: string,
  userId: string,
  input: UpdateSubjectInput,
) {
  const [subject] = await db
    .update(subjectsTable)
    .set(input)
    .where(
      and(
        eq(subjectsTable.subjectId, subjectId),
        eq(subjectsTable.userId, userId),
      ),
    )
    .returning();

  return subject ?? null;
}

export async function deleteSubject(subjectId: string, userId: string) {
  const [subject] = await db
    .delete(subjectsTable)
    .where(
      and(
        eq(subjectsTable.subjectId, subjectId),
        eq(subjectsTable.userId, userId),
      ),
    )
    .returning();

  return subject ?? null;
}
