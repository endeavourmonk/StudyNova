import { index, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

import { notesTable } from "./notes";

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
};

export const quizzesTable = pgTable(
  "quizzes",
  {
    quizId: uuid("quiz_id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    noteId: uuid("note_id")
      .notNull()
      .references(() => notesTable.noteId, { onDelete: "cascade" }),

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
