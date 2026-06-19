import { index, integer, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

import { quizzesTable } from "./quizzes";
import { usersTable } from "./users";

export const quizAttemptsTable = pgTable(
  "quiz_attempts",
  {
    attemptId: uuid("attempt_id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzesTable.quizId, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.userId, { onDelete: "cascade" }),

    score: integer("score").notNull(),

    totalQuestions: integer("total_questions").notNull(),

    answersJson: jsonb("answers_json").$type<number[]>().notNull(),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("quiz_attempts_quiz_id_idx").on(table.quizId),
    index("quiz_attempts_user_id_idx").on(table.userId),
    index("quiz_attempts_completed_at_idx").on(table.completedAt),
  ],
);
