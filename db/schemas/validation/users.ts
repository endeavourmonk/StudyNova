import { z } from "zod";

export const createUserSchema = z.object({
  clerkUserId: z.string().min(1).max(256),
  username: z.string().min(1).max(64),
  email: z.string().email().max(256),
  firstName: z.string().min(1).max(64),
  lastName: z.string().max(64).optional(),
});

export const updateUserSchema = createUserSchema
  .pick({ username: true, email: true, firstName: true, lastName: true })
  .partial();

export const userParamsSchema = z.object({
  userId: z.string().uuid(),
  clerkUserId: z.string().min(1).max(256),
});
