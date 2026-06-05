"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createQuiz, deleteQuiz } from "@/db/queries/quizzes";
import { fetchNoteByIdForSubject } from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";
import { generateQuiz } from "@/lib/generateQuiz";

async function getAuthenticatedDbUser() {
  const { userId: clerkUserId } = await auth.protect();
  return fetchUserByClerkId(clerkUserId);
}

export type GenerateQuizActionResult =
  | { success: true; quizId: string }
  | { success: false; error: string };

export async function generateQuizAction(
  noteId: string,
  subjectId: string,
): Promise<GenerateQuizActionResult> {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    return { success: false, error: "Your account is still being set up. Please try again." };
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    return { success: false, error: "Subject not found." };
  }

  const note = await fetchNoteByIdForSubject(noteId, subjectId, dbUser.userId);
  if (!note) {
    return { success: false, error: "Note not found." };
  }

  let questions;
  try {
    questions = await generateQuiz({
      noteTitle: note.title,
      noteContent: note.content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate quiz";
    return { success: false, error: message };
  }

  const quiz = await createQuiz(dbUser.userId, {
    noteId: note.noteId,
    questionsJson: questions,
  });

  if (!quiz) {
    return { success: false, error: "Failed to save quiz." };
  }

  revalidatePath(`/subjects/${subjectId}/notes/${noteId}`);
  redirect(`/subjects/${subjectId}/notes/${noteId}/quiz/${quiz.quizId}`);
}

export async function deleteQuizAction(
  quizId: string,
  subjectId: string,
  noteId: string,
) {
  const dbUser = await getAuthenticatedDbUser();
  if (!dbUser) {
    throw new Error("User not found.");
  }

  const deleted = await deleteQuiz(quizId, dbUser.userId);
  if (!deleted) {
    throw new Error("Quiz not found.");
  }

  revalidatePath(`/subjects/${subjectId}/notes/${noteId}`);
}
