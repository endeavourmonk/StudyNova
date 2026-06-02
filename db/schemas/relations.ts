import { relations } from "drizzle-orm";

import { notesTable } from "./notes";
import { quizzesTable } from "./quizzes";
import { subjectsTable } from "./subjects";
import { usersTable } from "./users";

export const userRelations = relations(usersTable, ({ many }) => ({
  subjects: many(subjectsTable),
  notes: many(notesTable),
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

export const quizRelations = relations(quizzesTable, ({ one }) => ({
  note: one(notesTable, {
    fields: [quizzesTable.noteId],
    references: [notesTable.noteId],
  }),
}));
