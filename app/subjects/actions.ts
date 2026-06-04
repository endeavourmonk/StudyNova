"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createSubject as createSubjectInDb,
  deleteSubject as deleteSubjectInDb,
  updateSubject as updateSubjectInDb,
} from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "@/db/schemas/validation/subjects";

export type SubjectFormState = {
  error: string | null;
  name: string;
};

async function getAuthenticatedDbUser() {
  const { userId: clerkUserId } = await auth.protect();
  return fetchUserByClerkId(clerkUserId);
}

export async function createSubjectAction(
  _prevState: SubjectFormState,
  formData: FormData,
): Promise<SubjectFormState> {
  const dbUser = await getAuthenticatedDbUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!dbUser) {
    return {
      error: "Your account is still being set up. Please try again in a moment.",
      name,
    };
  }

  const parsed = createSubjectSchema.safeParse({ name });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return { error: firstIssue, name };
  }

  const subject = await createSubjectInDb(dbUser.userId, parsed.data);
  if (!subject) {
    return { error: "Failed to create subject", name };
  }

  revalidatePath("/app");
  redirect(`/subjects/${subject.subjectId}`);
}

export async function updateSubjectAction(
  subjectId: string,
  _prevState: SubjectFormState,
  formData: FormData,
): Promise<SubjectFormState> {
  const dbUser = await getAuthenticatedDbUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!dbUser) {
    return {
      error: "Your account is still being set up. Please try again in a moment.",
      name,
    };
  }

  const parsed = updateSubjectSchema.safeParse({ name });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return { error: firstIssue, name };
  }

  const subject = await updateSubjectInDb(subjectId, dbUser.userId, parsed.data);
  if (!subject) {
    return { error: "Subject not found", name };
  }

  revalidatePath("/app");
  revalidatePath(`/subjects/${subjectId}`);
  redirect(`/subjects/${subjectId}`);
}

export async function deleteSubjectAction(subjectId: string) {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    throw new Error("User not found");
  }

  const deleted = await deleteSubjectInDb(subjectId, dbUser.userId);
  if (!deleted) {
    throw new Error("Subject not found");
  }

  revalidatePath("/app");
  redirect("/app");
}
