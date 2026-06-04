import { z } from "zod";

export const createUserSchema = z.object({
  clerkUserId: z.string().min(1).max(256),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(64)
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores",
    ),
  email: z.string().email().max(256),
  firstName: z.string().min(1, "First name is required").max(64),
  lastName: z.string().max(64).optional(),
});

export const updateUserSchema = createUserSchema
  .pick({ username: true, firstName: true, lastName: true })
  .partial();

export const profileUpdateSchema = createUserSchema.pick({
  username: true,
  firstName: true,
  lastName: true,
});

export const usernameCheckSchema = createUserSchema.pick({ username: true });

export const userParamsSchema = z.object({
  userId: z.string().uuid(),
  clerkUserId: z.string().min(1).max(256),
});
