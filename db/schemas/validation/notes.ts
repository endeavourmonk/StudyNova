import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(256),
  topic: z.string().min(1).max(256),
  content: z.string().min(1),
  subjectId: z.string().uuid(),
});

export const updateNoteSchema = createNoteSchema
  .pick({ title: true, topic: true, content: true, subjectId: true })
  .partial();

export const fetchNotesParamsSchema = z.object({
  subjectId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});
