import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { NoteForm } from "@/app/notes/note-form";
import { Button } from "@/components/ui/button";
import { fetchNoteByIdForSubject } from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";

type EditNotePageProps = {
  params: Promise<{ subjectId: string; noteId: string }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
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
          <Link href={`/subjects/${subject.subjectId}/notes/${note.noteId}`}>
            <ChevronLeft />
            {note.title}
          </Link>
        </Button>
        <NoteForm
          mode="edit"
          subjectId={subject.subjectId}
          subjectName={subject.name}
          noteId={note.noteId}
          initialTitle={note.title}
          initialTopic={note.topic}
          initialContent={note.content}
        />
      </main>
    </div>
  );
}
