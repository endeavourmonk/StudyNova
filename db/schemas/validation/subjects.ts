import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(1).max(128),
});

export const updateSubjectSchema = createSubjectSchema.partial();
