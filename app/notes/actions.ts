"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createNote as createNoteInDb,
  deleteNote as deleteNoteInDb,
  updateNote as updateNoteInDb,
} from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";
import {
  createNoteSchema,
  updateNoteSchema,
} from "@/db/schemas/validation/notes";

export type NoteFormState = {
  error: string | null;
  title: string;
  topic: string;
  content: string;
};

async function getAuthenticatedDbUser() {
  const { userId: clerkUserId } = await auth.protect();
  return fetchUserByClerkId(clerkUserId);
}

function parseNoteFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    topic: String(formData.get("topic") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
  };
}

export async function createNoteAction(
  subjectId: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const dbUser = await getAuthenticatedDbUser();
  const fields = parseNoteFormData(formData);

  if (!dbUser) {
    return {
      error: "Your account is still being set up. Please try again in a moment.",
      ...fields,
    };
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    return { error: "Subject not found", ...fields };
  }

  const parsed = createNoteSchema.safeParse({ ...fields, subjectId });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return { error: firstIssue, ...fields };
  }

  const note = await createNoteInDb(dbUser.userId, parsed.data);
  if (!note) {
    return { error: "Failed to create note", ...fields };
  }

  revalidatePath(`/subjects/${subjectId}`);
  redirect(`/subjects/${subjectId}/notes/${note.noteId}`);
}

export async function updateNoteAction(
  subjectId: string,
  noteId: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const dbUser = await getAuthenticatedDbUser();
  const fields = parseNoteFormData(formData);

  if (!dbUser) {
    return {
      error: "Your account is still being set up. Please try again in a moment.",
      ...fields,
    };
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    return { error: "Subject not found", ...fields };
  }

  const parsed = updateNoteSchema.safeParse({ ...fields, subjectId });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return { error: firstIssue, ...fields };
  }

  const note = await updateNoteInDb(noteId, dbUser.userId, parsed.data);
  if (!note) {
    return { error: "Note not found", ...fields };
  }

  revalidatePath(`/subjects/${subjectId}`);
  revalidatePath(`/subjects/${subjectId}/notes/${noteId}`);
  redirect(`/subjects/${subjectId}/notes/${noteId}`);
}

export async function deleteNoteAction(subjectId: string, noteId: string) {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    throw new Error("User not found");
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    throw new Error("Subject not found");
  }

  const deleted = await deleteNoteInDb(noteId, dbUser.userId);
  if (!deleted || deleted.subjectId !== subjectId) {
    throw new Error("Note not found");
  }

  revalidatePath(`/subjects/${subjectId}`);
  redirect(`/subjects/${subjectId}`);
}
