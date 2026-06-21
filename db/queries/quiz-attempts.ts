import { and, avg, count, desc, eq, inArray, max, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "../index";
import { notesTable } from "../schemas/notes";
import { quizAttemptsTable } from "../schemas/quiz-attempts";
import { quizzesTable } from "../schemas/quizzes";
import { subjectsTable } from "../schemas/subjects";
import {
  createQuizAttemptSchema,
  fetchQuizAttemptsParamsSchema,
} from "../schemas/validation/quiz-attempts";
import {
  PaginationParams,
  resolvePagination,
  toPaginatedResult,
} from "./types";

export type CreateQuizAttemptInput = z.infer<typeof createQuizAttemptSchema>;
export type FetchQuizAttemptsManyParams = PaginationParams &
  z.infer<typeof fetchQuizAttemptsParamsSchema>;

/**
 * Insert a new quiz attempt.
 */
export async function createQuizAttempt(
  userId: string,
  input: CreateQuizAttemptInput,
) {
  const [attempt] = await db
    .insert(quizAttemptsTable)
    .values({
      quizId: input.quizId,
      userId,
      score: input.score,
      totalQuestions: input.totalQuestions,
      answersJson: input.answersJson,
    })
    .returning();

  return attempt;
}

/**
 * Fetch all attempts for a specific quiz (scoped to user).
 */
export async function fetchAttemptsByQuiz(quizId: string, userId: string) {
  return db
    .select({
      attemptId: quizAttemptsTable.attemptId,
      score: quizAttemptsTable.score,
      totalQuestions: quizAttemptsTable.totalQuestions,
      completedAt: quizAttemptsTable.completedAt,
    })
    .from(quizAttemptsTable)
    .where(
      and(
        eq(quizAttemptsTable.quizId, quizId),
        eq(quizAttemptsTable.userId, userId),
      ),
    )
    .orderBy(desc(quizAttemptsTable.completedAt));
}

/**
 * Fetch recent attempts across all quizzes (for dashboard).
 */
export async function fetchRecentAttempts(userId: string, limit = 10) {
  return db
    .select({
      attemptId: quizAttemptsTable.attemptId,
      score: quizAttemptsTable.score,
      totalQuestions: quizAttemptsTable.totalQuestions,
      completedAt: quizAttemptsTable.completedAt,
      quizId: quizAttemptsTable.quizId,
      noteId: quizzesTable.noteId,
      noteTitle: notesTable.title,
      subjectName: subjectsTable.name,
      subjectId: subjectsTable.subjectId,
    })
    .from(quizAttemptsTable)
    .innerJoin(quizzesTable, eq(quizAttemptsTable.quizId, quizzesTable.quizId))
    .innerJoin(notesTable, eq(quizzesTable.noteId, notesTable.noteId))
    .innerJoin(
      subjectsTable,
      eq(notesTable.subjectId, subjectsTable.subjectId),
    )
    .where(eq(quizAttemptsTable.userId, userId))
    .orderBy(desc(quizAttemptsTable.completedAt))
    .limit(limit);
}

/**
 * Aggregate stats for the user: total attempts, average %, best %, quizzes taken.
 */
export async function fetchOverallStats(userId: string) {
  const [row] = await db
    .select({
      totalAttempts: count().as("total_attempts"),
      avgPercentage: avg(
        sql<number>`(${quizAttemptsTable.score}::float / ${quizAttemptsTable.totalQuestions} * 100)`,
      ).as("avg_percentage"),
      bestPercentage: max(
        sql<number>`(${quizAttemptsTable.score}::float / ${quizAttemptsTable.totalQuestions} * 100)`,
      ).as("best_percentage"),
      uniqueQuizzes:
        sql<number>`count(distinct ${quizAttemptsTable.quizId})`.as(
          "unique_quizzes",
        ),
    })
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.userId, userId));

  return {
    totalAttempts: row?.totalAttempts ?? 0,
    avgPercentage: Math.round(Number(row?.avgPercentage ?? 0)),
    bestPercentage: Math.round(Number(row?.bestPercentage ?? 0)),
    uniqueQuizzes: Number(row?.uniqueQuizzes ?? 0),
  };
}

/**
 * Per-subject breakdown: attempts, average score %.
 */
export async function fetchSubjectStats(userId: string) {
  return db
    .select({
      subjectId: subjectsTable.subjectId,
      subjectName: subjectsTable.name,
      attempts: count().as("attempts"),
      avgPercentage: avg(
        sql<number>`(${quizAttemptsTable.score}::float / ${quizAttemptsTable.totalQuestions} * 100)`,
      ).as("avg_percentage"),
    })
    .from(quizAttemptsTable)
    .innerJoin(quizzesTable, eq(quizAttemptsTable.quizId, quizzesTable.quizId))
    .innerJoin(notesTable, eq(quizzesTable.noteId, notesTable.noteId))
    .innerJoin(
      subjectsTable,
      eq(notesTable.subjectId, subjectsTable.subjectId),
    )
    .where(eq(quizAttemptsTable.userId, userId))
    .groupBy(subjectsTable.subjectId, subjectsTable.name)
    .orderBy(desc(sql`attempts`));
}

/**
 * Best attempt score for each quiz (for showing "Best: 8/10" on quiz list).
 */
export async function fetchBestAttemptPerQuiz(
  userId: string,
  quizIds: string[],
) {
  if (quizIds.length === 0) return [];

  return db
    .select({
      quizId: quizAttemptsTable.quizId,
      bestScore: max(quizAttemptsTable.score).as("best_score"),
      totalQuestions: max(quizAttemptsTable.totalQuestions).as(
        "total_questions",
      ),
      attemptCount: count().as("attempt_count"),
    })
    .from(quizAttemptsTable)
    .where(
      and(
        eq(quizAttemptsTable.userId, userId),
        inArray(quizAttemptsTable.quizId, quizIds),
      ),
    )
    .groupBy(quizAttemptsTable.quizId);
}
