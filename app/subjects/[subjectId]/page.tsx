import Link from "next/link";
import { ChevronLeft, FileText, Pencil, Plus } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { DeleteSubjectButton } from "@/app/subjects/delete-subject-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchNotesMany } from "@/db/queries/notes";
import { fetchSubjectById } from "@/db/queries/subjects";
import { getCurrentUser } from "@/db/queries/get-current-user";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type SubjectDetailPageProps = {
  params: Promise<{ subjectId: string }>;
};

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const { subjectId } = await params;
  const dbUser = await getCurrentUser();

  if (!dbUser) {
    notFound();
  }

  const [subject, { data: notes }] = await Promise.all([
    fetchSubjectById(subjectId, dbUser.userId),
    fetchNotesMany(dbUser.userId, { subjectId, pageSize: 100 }),
  ]);

  if (!subject) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/app">
            <ChevronLeft />
            Dashboard
          </Link>
        </Button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {subject.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Created {formatDate(subject.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/subjects/${subject.subjectId}/edit`}>
                <Pencil />
                Edit subject
              </Link>
            </Button>
            <DeleteSubjectButton
              subjectId={subject.subjectId}
              subjectName={subject.name}
            />
          </div>
        </div>

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Notes</h2>
              <p className="text-sm text-muted-foreground">
                Study notes in this subject.
              </p>
            </div>
            <Button asChild>
              <Link href={`/subjects/${subject.subjectId}/notes/new`}>
                <Plus />
                New note
              </Link>
            </Button>
          </div>

          {notes.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader className="items-center text-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
                  <FileText className="size-6 text-muted-foreground" />
                </div>
                <CardTitle>No notes yet</CardTitle>
                <CardDescription>
                  Create your first note for {subject.name}.
                </CardDescription>
                <Button className="mt-4" asChild>
                  <Link href={`/subjects/${subject.subjectId}/notes/new`}>
                    <Plus />
                    Create note
                  </Link>
                </Button>
              </CardHeader>
            </Card>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Topic</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Updated
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.noteId}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/subjects/${subject.subjectId}/notes/${note.noteId}`}
                          className="hover:underline"
                        >
                          {note.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {note.topic}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {formatDate(note.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/subjects/${subject.subjectId}/notes/${note.noteId}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
