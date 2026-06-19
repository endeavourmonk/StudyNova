"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createRoadmap,
  deleteRoadmap as deleteRoadmapInDb,
} from "@/db/queries/roadmaps";
import { fetchUserByClerkId } from "@/db/queries/users";
import { generateRoadmap } from "@/lib/generateRoadmap";

async function getAuthenticatedDbUser() {
  const { userId: clerkUserId } = await auth.protect();
  return fetchUserByClerkId(clerkUserId);
}

export type GenerateRoadmapActionResult =
  | { success: true; roadmapId: string }
  | { success: false; error: string };

export async function generateRoadmapAction(
  topic: string,
): Promise<GenerateRoadmapActionResult> {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    return {
      success: false,
      error: "Your account is still being set up. Please try again.",
    };
  }

  const trimmed = topic.trim();
  if (!trimmed || trimmed.length > 256) {
    return {
      success: false,
      error: "Please enter a topic (max 256 characters).",
    };
  }

  let steps;
  try {
    steps = await generateRoadmap({ topic: trimmed });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate roadmap";
    return { success: false, error: message };
  }

  const roadmap = await createRoadmap(dbUser.userId, {
    topic: trimmed,
    stepsJson: steps,
  });

  if (!roadmap) {
    return { success: false, error: "Failed to save roadmap." };
  }

  revalidatePath("/roadmaps");
  redirect(`/roadmaps/${roadmap.roadmapId}`);
}

export async function deleteRoadmapAction(roadmapId: string) {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    throw new Error("User not found.");
  }

  const deleted = await deleteRoadmapInDb(roadmapId, dbUser.userId);
  if (!deleted) {
    throw new Error("Roadmap not found.");
  }

  revalidatePath("/roadmaps");
  redirect("/roadmaps");
}
