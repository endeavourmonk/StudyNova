"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
import { generateNote } from "@/lib/generateNote";

export type NoteFormState = {
  error: string | null;
  title: string;
  topic: string;
  content: string | null;
};

const generateNoteInputSchema = z.object({
  topic: z.string().min(1).max(256),
});

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
  const fields = parseNoteFormData(formData);
  const intent = String(formData.get("intent") ?? "create");

  const dbUser = await getAuthenticatedDbUser();

  if (!dbUser) {
    return {
      error:
        "Your account is still being set up. Please try again in a moment.",
      title: fields.title,
      topic: fields.topic,
      content: _prevState.content,
    };
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    return {
      error: "Subject not found",
      title: fields.title,
      topic: fields.topic,
      content: _prevState.content,
    };
  }

  let title = fields.title;
  let topic = fields.topic;
  let content = fields.content;

  if (intent === "generate") {
    const parsedTopic = generateNoteInputSchema.safeParse({
      topic: fields.topic,
    });
    if (!parsedTopic.success) {
      const firstIssue =
        parsedTopic.error.issues[0]?.message ?? "Topic is required";
      return {
        error: firstIssue,
        title: fields.title,
        topic: fields.topic,
        content: null,
      };
    }

    try {
      const generated = await generateNote({
        subjectName: subject.name,
        topic: parsedTopic.data.topic,
      });

      title = fields.title || generated.title;
      topic = parsedTopic.data.topic;
      content = generated.content;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate note";
      return {
        error: message,
        title: fields.title,
        topic: fields.topic,
        content: null,
      };
    }
  } else if (!content) {
    return {
      error: "Content is required for manual notes",
      title: fields.title,
      topic: fields.topic,
      content: "",
    };
  }

  const parsed = createNoteSchema.safeParse({
    title,
    topic,
    content,
    subjectId,
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return {
      error: firstIssue,
      title: fields.title,
      topic: fields.topic,
      content,
    };
  }

  const note = await createNoteInDb(dbUser.userId, parsed.data);
  if (!note) {
    return {
      error: "Failed to create note",
      title: fields.title,
      topic: fields.topic,
      content,
    };
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
  const fields = parseNoteFormData(formData);

  const dbUser = await getAuthenticatedDbUser();

  if (!dbUser) {
    return {
      error:
        "Your account is still being set up. Please try again in a moment.",
      title: fields.title,
      topic: fields.topic,
      content: fields.content,
    };
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    return {
      error: "Subject not found",
      title: fields.title,
      topic: fields.topic,
      content: fields.content,
    };
  }

  const parsed = updateNoteSchema.safeParse({
    title: fields.title,
    topic: fields.topic,
    content: fields.content,
    subjectId,
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Validation failed";
    return {
      error: firstIssue,
      title: fields.title,
      topic: fields.topic,
      content: fields.content,
    };
  }

  const note = await updateNoteInDb(noteId, dbUser.userId, parsed.data);
  if (!note) {
    return {
      error: "Note not found",
      title: fields.title,
      topic: fields.topic,
      content: fields.content,
    };
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
