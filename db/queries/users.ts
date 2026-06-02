import { and, count, desc, eq } from "drizzle-orm";

import { db } from "../index";
import { usersTable } from "../schemas/users";
import {
  PaginationParams,
  resolvePagination,
  toPaginatedResult,
} from "./types";

export type CreateUserInput = {
  clerkUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
};

export type UpdateUserInput = Partial<
  Pick<
    CreateUserInput,
    "username" | "email" | "firstName" | "lastName"
  >
>;

export async function fetchUsersMany(params: PaginationParams = {}) {
  const { page, pageSize, offset } = resolvePagination(params);

  const [data, [{ total }]] = await Promise.all([
    db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(usersTable),
  ]);

  return toPaginatedResult(data, total, page, pageSize);
}

export async function fetchUserById(userId: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.userId, userId));

  return user ?? null;
}

export async function fetchUserByClerkId(clerkUserId: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, clerkUserId));

  return user ?? null;
}

export async function createUser(input: CreateUserInput) {
  const [user] = await db.insert(usersTable).values(input).returning();

  return user;
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  const [user] = await db
    .update(usersTable)
    .set(input)
    .where(eq(usersTable.userId, userId))
    .returning();

  return user ?? null;
}

export async function deleteUser(userId: string) {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.userId, userId))
    .returning();

  return user ?? null;
}
