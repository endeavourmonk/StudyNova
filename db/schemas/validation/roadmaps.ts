import { z } from "zod";

export const roadmapStepSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const createRoadmapSchema = z.object({
  topic: z.string().min(1).max(256),
  stepsJson: z.array(roadmapStepSchema).min(1),
});

export const fetchRoadmapsParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});
