import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft, Pencil } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { DeleteNoteButton } from "@/app/notes/delete-note-button";
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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
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
            <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
              {note.content}
            </div>
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
          </div>
        </Card>
      </main>
    </div>
  );
}
