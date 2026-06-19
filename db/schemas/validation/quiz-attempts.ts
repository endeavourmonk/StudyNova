import { z } from "zod";

export const createQuizAttemptSchema = z.object({
  quizId: z.string().uuid(),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  answersJson: z.array(z.number().int().min(0).max(3)),
});

export const fetchQuizAttemptsParamsSchema = z.object({
  quizId: z.string().uuid().optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});
