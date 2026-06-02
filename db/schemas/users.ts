import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const usersTable = pgTable("users", {
  userId: uuid("user_id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  clerkUserId: varchar("clerk_user_id", { length: 256 }).notNull().unique(),

  username: varchar("username", { length: 64 }).unique().notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),

  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }),

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
});

export const userRelations = relations(usersTable, ({ many }) => ({}));
