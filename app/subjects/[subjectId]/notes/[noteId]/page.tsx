import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft, ClipboardList, Pencil } from "lucide-react";
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
import { fetchNoteByIdForSubject } from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";
import { fetchQuizzesMany } from "@/db/queries/quizzes";

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

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { subjectId, noteId } = await params;
  const { userId: clerkUserId } = await auth.protect();
  const dbUser = await fetchUserByClerkId(clerkUserId);

  if (!dbUser) {
    notFound();
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    notFound();
  }

  const note = await fetchNoteByIdForSubject(noteId, subjectId, dbUser.userId);
  if (!note) {
    notFound();
  }

  const { data: quizzes } = await fetchQuizzesMany(dbUser.userId, {
    noteId: note.noteId,
    pageSize: 20,
  });

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
              <GenerateQuizButton noteId={note.noteId} subjectId={subject.subjectId} />
            </div>
          </div>
        </Card>

        {/* Quiz History */}
        <section className="mx-auto mt-10 max-w-2xl">
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
              {quizzes.map((quiz, index) => (
                <Link
                  key={quiz.quizId}
                  href={`/subjects/${subject.subjectId}/notes/${note.noteId}/quiz/${quiz.quizId}`}
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
                        {quiz.questionsJson.length} questions · Generated {formatDateShort(quiz.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" tabIndex={-1}>
                    Attempt →
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
