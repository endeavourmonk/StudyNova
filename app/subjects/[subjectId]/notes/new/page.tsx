import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { NoteForm } from "@/app/notes/note-form";
import { Button } from "@/components/ui/button";
import { fetchSubjectById } from "@/db/queries/subjects";
import { getCurrentUser } from "@/db/queries/get-current-user";

type NewNotePageProps = {
  params: Promise<{ subjectId: string }>;
};

export default async function NewNotePage({ params }: NewNotePageProps) {
  const { subjectId } = await params;
  const dbUser = await getCurrentUser();

  if (!dbUser) {
    notFound();
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
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
        <NoteForm
          mode="create"
          subjectId={subject.subjectId}
          subjectName={subject.name}
        />
      </main>
    </div>
  );
}
