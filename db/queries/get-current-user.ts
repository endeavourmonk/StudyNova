import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { fetchUserByClerkId } from "./users";

/**
 * Returns the authenticated DB user for the current request.
 * Uses React `cache()` to deduplicate the Clerk auth() + DB lookup
 * across all Server Components rendered in the same request tree.
 */
export const getCurrentUser = cache(async () => {
  const { userId: clerkUserId } = await auth.protect();
  return fetchUserByClerkId(clerkUserId);
});
