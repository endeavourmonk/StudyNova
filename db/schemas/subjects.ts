import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

import { usersTable } from "./users";

export const subjectsTable = pgTable(
  "subjects",
  {
    subjectId: uuid("subject_id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    name: varchar("name", { length: 128 }).notNull(),

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
  (table) => [index("subjects_user_id_idx").on(table.userId)],
);
