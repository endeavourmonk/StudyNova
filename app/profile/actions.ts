"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  fetchUserByClerkId,
  isUsernameTaken,
  updateUser,
} from "@/db/queries/users";
import {
  profileUpdateSchema,
  usernameCheckSchema,
} from "@/db/schemas/validation/users";

export type ProfileData = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UpdateProfileState = {
  error: string | null;
  success: string | null;
  profile: ProfileData;
};

export type UsernameCheckResult = {
  status: "idle" | "invalid" | "available" | "taken";
};

async function getAuthenticatedDbUser() {
  const { userId: clerkUserId } = await auth.protect();
  const dbUser = await fetchUserByClerkId(clerkUserId);
  return dbUser;
}

export async function checkUsernameAvailability(
  username: string,
): Promise<UsernameCheckResult> {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    return { status: "invalid" };
  }

  const normalized = username.toLowerCase().replace(/\s/g, "_");

  if (normalized === dbUser.username) {
    return { status: "idle" };
  }

  const parsed = usernameCheckSchema.safeParse({ username: normalized });
  if (!parsed.success) {
    return { status: "invalid" };
  }

  const taken = await isUsernameTaken(parsed.data.username, dbUser.userId);
  return { status: taken ? "taken" : "available" };
}

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    return {
      ..._prevState,
      error: "User not found. Please try again later.",
      success: null,
    };
  }

  const raw = {
    username: String(formData.get("username") ?? "")
      .toLowerCase()
      .replace(/\s/g, "_"),
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
  };

  const parsed = profileUpdateSchema.safeParse({
    username: raw.username,
    firstName: raw.firstName,
    lastName: raw.lastName || undefined,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return { ..._prevState, error: firstIssue, success: null };
  }

  const { username, firstName, lastName } = parsed.data;

  if (username !== dbUser.username) {
    const taken = await isUsernameTaken(username, dbUser.userId);
    if (taken) {
      return {
        ..._prevState,
        error: "Username is already taken",
        success: null,
      };
    }
  }

  const updated = await updateUser(dbUser.userId, {
    username,
    firstName,
    lastName: lastName ?? "",
  });

  if (!updated) {
    return {
      ..._prevState,
      error: "Failed to update profile",
      success: null,
    };
  }

  revalidatePath("/profile");

  const profile: ProfileData = {
    userId: updated.userId,
    username: updated.username,
    firstName: updated.firstName,
    lastName: updated.lastName ?? "",
    email: updated.email,
  };

  return {
    error: null,
    success: "Profile updated successfully.",
    profile,
  };
}
