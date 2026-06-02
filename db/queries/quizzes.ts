import { and, count, desc, eq } from "drizzle-orm";

import { db } from "../index";
import { notesTable } from "../schemas/notes";
import { quizzesTable, QuizQuestion } from "../schemas/quizzes";
import {
  PaginationParams,
  resolvePagination,
  toPaginatedResult,
} from "./types";

export type CreateQuizInput = {
  noteId: string;
  questionsJson: QuizQuestion[];
};

export type UpdateQuizInput = Partial<Pick<CreateQuizInput, "questionsJson">>;

export type FetchQuizzesManyParams = PaginationParams & {
  noteId?: string;
};

export async function fetchQuizzesMany(
  userId: string,
  params: FetchQuizzesManyParams = {},
) {
  const { page, pageSize, offset } = resolvePagination(params);

  const conditions = [eq(notesTable.userId, userId)];

  if (params.noteId) {
    conditions.push(eq(quizzesTable.noteId, params.noteId));
  }

  const where = and(...conditions);

  const [data, [{ total }]] = await Promise.all([
    db
      .select({
        quizId: quizzesTable.quizId,
        noteId: quizzesTable.noteId,
        questionsJson: quizzesTable.questionsJson,
        createdAt: quizzesTable.createdAt,
      })
      .from(quizzesTable)
      .innerJoin(notesTable, eq(quizzesTable.noteId, notesTable.noteId))
      .where(where)
      .orderBy(desc(quizzesTable.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ total: count() })
      .from(quizzesTable)
      .innerJoin(notesTable, eq(quizzesTable.noteId, notesTable.noteId))
      .where(where),
  ]);

  return toPaginatedResult(data, total, page, pageSize);
}

export async function fetchQuizById(quizId: string, userId: string) {
  const [row] = await db
    .select({
      quizId: quizzesTable.quizId,
      noteId: quizzesTable.noteId,
      questionsJson: quizzesTable.questionsJson,
      createdAt: quizzesTable.createdAt,
    })
    .from(quizzesTable)
    .innerJoin(notesTable, eq(quizzesTable.noteId, notesTable.noteId))
    .where(and(eq(quizzesTable.quizId, quizId), eq(notesTable.userId, userId)));

  return row ?? null;
}

export async function createQuiz(userId: string, input: CreateQuizInput) {
  const note = await db
    .select({ noteId: notesTable.noteId })
    .from(notesTable)
    .where(
      and(eq(notesTable.noteId, input.noteId), eq(notesTable.userId, userId)),
    );

  if (!note.length) {
    return null;
  }

  const [quiz] = await db
    .insert(quizzesTable)
    .values({
      noteId: input.noteId,
      questionsJson: input.questionsJson,
    })
    .returning();

  return quiz;
}

export async function updateQuiz(
  quizId: string,
  userId: string,
  input: UpdateQuizInput,
) {
  const existing = await fetchQuizById(quizId, userId);

  if (!existing) {
    return null;
  }

  const [quiz] = await db
    .update(quizzesTable)
    .set(input)
    .where(eq(quizzesTable.quizId, quizId))
    .returning();

  return quiz ?? null;
}

export async function deleteQuiz(quizId: string, userId: string) {
  const existing = await fetchQuizById(quizId, userId);

  if (!existing) {
    return null;
  }

  const [quiz] = await db
    .delete(quizzesTable)
    .where(eq(quizzesTable.quizId, quizId))
    .returning();

  return quiz ?? null;
}
