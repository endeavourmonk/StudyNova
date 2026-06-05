import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { QuizAttempt } from "./quiz-attempt";
import { fetchQuizById } from "@/db/queries/quizzes";
import { fetchNoteByIdForSubject } from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";

type QuizPageProps = {
  params: Promise<{ subjectId: string; noteId: string; quizId: string }>;
};

export default async function QuizPage({ params }: QuizPageProps) {
  const { subjectId, noteId, quizId } = await params;
  const { userId: clerkUserId } = await auth.protect();
  const dbUser = await fetchUserByClerkId(clerkUserId);

  if (!dbUser) {
    notFound();
  }

  const [subject, note, quiz] = await Promise.all([
    fetchSubjectById(subjectId, dbUser.userId),
    fetchNoteByIdForSubject(noteId, subjectId, dbUser.userId),
    fetchQuizById(quizId, dbUser.userId),
  ]);

  if (!subject || !note || !quiz || quiz.noteId !== noteId) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <QuizAttempt
          quizId={quiz.quizId}
          noteId={note.noteId}
          subjectId={subject.subjectId}
          noteTitle={note.title}
          questions={quiz.questionsJson}
        />
      </main>
    </div>
  );
}
