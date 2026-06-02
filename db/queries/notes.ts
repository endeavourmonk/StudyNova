import { and, count, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { z } from "zod";

import { db } from "../index";
import { notesTable } from "../schemas/notes";
import {
  PaginationParams,
  resolvePagination,
  toPaginatedResult,
} from "./types";
import {
  createNoteSchema,
  updateNoteSchema,
  fetchNotesParamsSchema,
} from "../schemas/validation/notes";

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type FetchNotesManyParams = PaginationParams &
  z.infer<typeof fetchNotesParamsSchema>;

export async function fetchNotesMany(
  userId: string,
  params: FetchNotesManyParams = {},
) {
  const { page, pageSize, offset } = resolvePagination(params);
  const conditions: SQL[] = [eq(notesTable.userId, userId)];

  if (params.subjectId) {
    conditions.push(eq(notesTable.subjectId, params.subjectId));
  }

  if (params.search) {
    const pattern = `%${params.search}%`;
    conditions.push(
      or(
        ilike(notesTable.title, pattern),
        ilike(notesTable.topic, pattern),
        ilike(notesTable.content, pattern),
      )!,
    );
  }

  const where = and(...conditions);

  const [data, [{ total }]] = await Promise.all([
    db
      .select()
      .from(notesTable)
      .where(where)
      .orderBy(desc(notesTable.updatedAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(notesTable).where(where),
  ]);

  return toPaginatedResult(data, total, page, pageSize);
}

export async function fetchNoteById(noteId: string, userId: string) {
  const [note] = await db
    .select()
    .from(notesTable)
    .where(and(eq(notesTable.noteId, noteId), eq(notesTable.userId, userId)));

  return note ?? null;
}

export async function createNote(userId: string, input: CreateNoteInput) {
  const [note] = await db
    .insert(notesTable)
    .values({ ...input, userId })
    .returning();

  return note;
}

export async function updateNote(
  noteId: string,
  userId: string,
  input: UpdateNoteInput,
) {
  const [note] = await db
    .update(notesTable)
    .set(input)
    .where(and(eq(notesTable.noteId, noteId), eq(notesTable.userId, userId)))
    .returning();

  return note ?? null;
}

export async function deleteNote(noteId: string, userId: string) {
  const [note] = await db
    .delete(notesTable)
    .where(and(eq(notesTable.noteId, noteId), eq(notesTable.userId, userId)))
    .returning();

  return note ?? null;
}
