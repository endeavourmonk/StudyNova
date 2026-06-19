import { relations } from "drizzle-orm";

import { notesTable } from "./notes";
import { quizAttemptsTable } from "./quiz-attempts";
import { quizzesTable } from "./quizzes";
import { subjectsTable } from "./subjects";
import { usersTable } from "./users";

export const userRelations = relations(usersTable, ({ many }) => ({
  subjects: many(subjectsTable),
  notes: many(notesTable),
  quizAttempts: many(quizAttemptsTable),
}));

export const subjectRelations = relations(subjectsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [subjectsTable.userId],
    references: [usersTable.userId],
  }),
  notes: many(notesTable),
}));

export const noteRelations = relations(notesTable, ({ one, many }) => ({
  subject: one(subjectsTable, {
    fields: [notesTable.subjectId],
    references: [subjectsTable.subjectId],
  }),
  user: one(usersTable, {
    fields: [notesTable.userId],
    references: [usersTable.userId],
  }),
  quizzes: many(quizzesTable),
}));

export const quizRelations = relations(quizzesTable, ({ one, many }) => ({
  note: one(notesTable, {
    fields: [quizzesTable.noteId],
    references: [notesTable.noteId],
  }),
  attempts: many(quizAttemptsTable),
}));

export const quizAttemptRelations = relations(quizAttemptsTable, ({ one }) => ({
  quiz: one(quizzesTable, {
    fields: [quizAttemptsTable.quizId],
    references: [quizzesTable.quizId],
  }),
  user: one(usersTable, {
    fields: [quizAttemptsTable.userId],
    references: [usersTable.userId],
  }),
}));
