import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

import { subjectsTable } from "./subjects";
import { usersTable } from "./users";

export const notesTable = pgTable(
  "notes",
  {
    noteId: uuid("note_id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    title: varchar("title", { length: 256 }).notNull(),
    topic: varchar("topic", { length: 256 }).notNull(),
    content: text("content").notNull(),

    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjectsTable.subjectId, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.userId, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("notes_user_id_idx").on(table.userId),
    index("notes_subject_id_idx").on(table.subjectId),
  ],
);
