import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { z } from "zod";

import { notesTable } from "./notes";
import { quizQuestionSchema } from "./validation/quizzes";
import { usersTable } from "./users";

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const quizzesTable = pgTable(
  "quizzes",
  {
    quizId: uuid("quiz_id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    noteId: uuid("note_id")
      .notNull()
      .references(() => notesTable.noteId, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.userId, { onDelete: "cascade" }),

    questionsJson: jsonb("questions_json").$type<QuizQuestion[]>().notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("quizzes_note_id_idx").on(table.noteId)],
);
