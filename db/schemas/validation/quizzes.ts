import { z } from "zod";

export const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  correctAnswer: z.number().int().min(0).max(3),
});

export const createQuizSchema = z.object({
  noteId: z.string().uuid(),
  questionsJson: z.array(quizQuestionSchema).min(1),
});

export const updateQuizSchema = z.object({
  questionsJson: z.array(quizQuestionSchema).min(1),
});

export const fetchQuizzesParamsSchema = z.object({
  noteId: z.string().uuid().optional(),
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});
