import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ClipboardList, Pencil, Trophy } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { DeleteNoteButton } from "@/app/notes/delete-note-button";
import { NoteContentView } from "@/app/notes/note-content-view";
import { GenerateQuizButton } from "./generate-quiz-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNoteByIdForSubject } from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { getCurrentUser } from "@/db/queries/get-current-user";
import { fetchQuizzesMany } from "@/db/queries/quizzes";
import { fetchBestAttemptPerQuiz } from "@/db/queries/quiz-attempts";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type NoteDetailPageProps = {
  params: Promise<{ subjectId: string; noteId: string }>;
};

// ─── Quiz history (async server component, streams in independently) ────────

async function QuizHistory({
  userId,
  noteId,
  subjectId,
}: {
  userId: string;
  noteId: string;
  subjectId: string;
}) {
  const { data: quizzes } = await fetchQuizzesMany(userId, {
    noteId,
    pageSize: 20,
  });

  // Fetch best attempts for all quizzes in parallel
  const quizIds = quizzes.map((q) => q.quizId);
  const bestAttempts = await fetchBestAttemptPerQuiz(userId, quizIds);
  const bestMap = new Map(
    bestAttempts.map((a) => [a.quizId, a]),
  );

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <ClipboardList className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Quizzes</h2>
        {quizzes.length > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {quizzes.length}
          </span>
        )}
      </div>

      {quizzes.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="items-center text-center py-8">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="size-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">No quizzes yet</CardTitle>
            <CardDescription>
              Generate a quiz from this note to test your knowledge.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz, index) => {
            const best = bestMap.get(quiz.quizId);
            return (
              <Link
                key={quiz.quizId}
                href={`/subjects/${subjectId}/notes/${noteId}/quiz/${quiz.quizId}`}
                className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {quizzes.length - index}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Quiz #{quizzes.length - index}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {quiz.questionsJson.length} questions · Generated{" "}
                      {formatDateShort(quiz.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {best ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Trophy className="size-3.5" />
                      Best: {Number(best.bestScore)}/{Number(best.totalQuestions)}
                    </span>
                  ) : null}
                  <Button variant="ghost" size="sm" tabIndex={-1}>
                    Attempt →
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function QuizHistorySkeleton() {
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-5 rounded" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { subjectId, noteId } = await params;
  const dbUser = await getCurrentUser();

  if (!dbUser) {
    notFound();
  }

  // Fetch subject and note in parallel — quiz history streams in separately below
  const [subject, note] = await Promise.all([
    fetchSubjectById(subjectId, dbUser.userId),
    fetchNoteByIdForSubject(noteId, subjectId, dbUser.userId),
  ]);

  if (!subject) notFound();
  if (!note) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href={`/subjects/${subject.subjectId}`}>
            <ChevronLeft />
            {subject.name}
          </Link>
        </Button>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">{note.title}</CardTitle>
            <CardDescription>Topic: {note.topic}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Created {formatDate(note.createdAt)}</span>
              <span>Updated {formatDate(note.updatedAt)}</span>
            </div>
            <NoteContentView content={note.content} />
          </CardContent>
          <div className="flex flex-wrap gap-2 border-t px-6 py-4">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/subjects/${subject.subjectId}/notes/${note.noteId}/edit`}
              >
                <Pencil />
                Edit
              </Link>
            </Button>
            <DeleteNoteButton
              subjectId={subject.subjectId}
              noteId={note.noteId}
              noteTitle={note.title}
            />
            <div className="ml-auto">
              <GenerateQuizButton
                noteId={note.noteId}
                subjectId={subject.subjectId}
              />
            </div>
          </div>
        </Card>

        {/* Quiz history streams in independently — note card above is already visible */}
        <section className="mx-auto mt-10 max-w-2xl">
          <Suspense fallback={<QuizHistorySkeleton />}>
            <QuizHistory
              userId={dbUser.userId}
              noteId={note.noteId}
              subjectId={subject.subjectId}
            />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
