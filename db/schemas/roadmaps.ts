import { index, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { z } from "zod";

import { usersTable } from "./users";
import { roadmapStepSchema } from "./validation/roadmaps";

export type RoadmapStep = z.infer<typeof roadmapStepSchema>;

export const roadmapsTable = pgTable(
  "roadmaps",
  {
    roadmapId: uuid("roadmap_id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.userId, { onDelete: "cascade" }),

    topic: varchar("topic", { length: 256 }).notNull(),

    stepsJson: jsonb("steps_json").$type<RoadmapStep[]>().notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("roadmaps_user_id_idx").on(table.userId)],
);
