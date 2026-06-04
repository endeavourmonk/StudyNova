import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { FolderOpen, Plus } from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
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
import { fetchSubjectsMany } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DashboardPage() {
  const { userId: clerkUserId } = await auth.protect();
  const dbUser = await fetchUserByClerkId(clerkUserId);

  if (!dbUser) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
          <p className="text-center text-muted-foreground">
            Your account is still being set up. Please try again in a moment.
          </p>
        </main>
      </div>
    );
  }

  const { data: subjects } = await fetchSubjectsMany(dbUser.userId, {
    pageSize: 100,
  });

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back, {dbUser.firstName}. Organize your study notes by
          subject.
        </p>

        <section className="mt-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Subjects</h2>
              <p className="text-sm text-muted-foreground">
                Course and topic areas for your notes.
              </p>
            </div>
            <Button asChild>
              <Link href="/subjects/new">
                <Plus />
                New subject
              </Link>
            </Button>
          </div>

          {subjects.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader className="items-center text-center">
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
                  <FolderOpen className="size-6 text-muted-foreground" />
                </div>
                <CardTitle>No subjects yet</CardTitle>
                <CardDescription>
                  Create your first subject to start organizing notes.
                </CardDescription>
                <Button className="mt-4" asChild>
                  <Link href="/subjects/new">
                    <Plus />
                    Create subject
                  </Link>
                </Button>
              </CardHeader>
            </Card>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Updated
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.subjectId}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/subjects/${subject.subjectId}`}
                          className="hover:underline"
                        >
                          {subject.name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {formatDate(subject.createdAt)}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {formatDate(subject.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/subjects/${subject.subjectId}/edit`}
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
